import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import Peaks, { PeaksInstance, PeaksOptions } from 'peaks.js';
import { SeekbarSeekEvent as SeekbarSeekEventInterface } from '../../interfaces/action/seekbarSeekEvent.interface';
import { ProjectVersion as ProjectVersionInterface } from '../../interfaces/projectVersion.interface';
import { VersionFile as VersionFileInterface } from '../../interfaces/versionFile.interface';
import { GlobalAudioPlayerService } from '../../services/global-audio-player.service';
import { WaveformPlayerService } from '../../services/waveform-player.service';

enum Retry {
	Timeout = 200, // 200ms
	Duration = 30 * 1e3, // 30s
}

@Component({
	selector: 'app-waveform-player',
	templateUrl: './waveform-player.component.html',
	styleUrls: ['./waveform-player.component.scss'],
})
export class WaveformPlayerComponent implements OnInit, AfterViewInit, OnChanges {
	private _player: HTMLAudioElement = new Audio();

	private _peaks?: PeaksInstance;

	@Input() projectVersion?: ProjectVersionInterface;

	@Input() showZoomview: boolean = true;
	@Input() showOverview: boolean = true;
	@Input() loadingSpinnerDiameter: number = 36;

	@Input() preventRightClick: boolean = true;
	@Input() forceConnectGlobalAudioPlayer: boolean = false;
	@Input() globalAudioPlayerVisibleOnSync: boolean = true;

	@Output() readonly play$ = new EventEmitter<void>();
	@Output() readonly peaksReady$ = new EventEmitter<void>();

	@ViewChild('container', { static: true }) private container?: ElementRef<HTMLDivElement>;
	@ViewChild('zoomviewContainer', { static: true }) private zoomviewContainer?: ElementRef<HTMLDivElement>;
	@ViewChild('overviewContainer', { static: true }) private overviewContainer?: ElementRef<HTMLDivElement>;

	loading: boolean = false;
	private seeking: boolean = false;

	private retries: number = 0;
	private retryTimeout?: number;

	get player(): HTMLAudioElement {
		return this._player;
	}

	get peaks(): PeaksInstance | undefined {
		return this._peaks;
	}

	get active(): boolean {
		return !!this.projectVersion?.files.length;
	}

	get globalAudioPlayer(): GlobalAudioPlayerService | undefined {
		return this.connectedToGlobalAudioPlayer ? this.globalAudioPlayerService : undefined;
	}

	get connectedToGlobalAudioPlayer(): boolean {
		return !!(
			this.projectVersion &&
			this.globalAudioPlayerService.projectVersion?.id === this.projectVersion?.id &&
			this.globalAudioPlayerService.player?.src
		);
	}

	constructor(
		private readonly waveformPlayerService: WaveformPlayerService,
		private readonly globalAudioPlayerService: GlobalAudioPlayerService,
	) {}

	protected contextMenu(event: MouseEvent) {
		if (this.preventRightClick) event.preventDefault();
	}

	ngOnInit() {
		this.setupAudioPlayer();
	}

	ngAfterViewInit() {
		for (const eventName of ['mousedown', 'touchstart'] as (keyof HTMLElementEventMap)[])
			this.overviewContainer!.nativeElement.addEventListener(eventName, (event: Event) => this.containerOnDown(event));
		for (const eventName of ['mousemove', 'touchmove'] as (keyof HTMLElementEventMap)[])
			this.overviewContainer!.nativeElement.addEventListener(eventName, (event: Event) => this.containerOnMove(event));
		this.updateSize().then();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['projectVersion'] && this.projectVersion) {
			this.loading = true;
			if (this.connectedToGlobalAudioPlayer)
				this.connectToGlobalAudioPlayer().then(async (synced) => {
					if (synced === false) await this.setup();
					this.loading = false;
				});
			else
				this.setup().then(() => {
					this.loading = false;
				});
		}
	}

	private async setup() {
		await this.fetchAudioURL();
		this.resetRetryCycle();
		await this.initPeaks();
		await this.updateSize();
	}

	@HostListener('window:resize')
	protected async onResize() {
		await this.updateSize();
		await new Promise<void>((resolve) => setTimeout(() => resolve(), 200));
		await this.updateSize();
	}

	async play() {
		if (this.connectedToGlobalAudioPlayer) this.globalAudioPlayer!.toggle();
		else {
			await this.connectToGlobalAudioPlayer();
			this.globalAudioPlayer!.play();
		}
	}

	private getSeekFactor(event: Event): number {
		const target = (
				this.showOverview
					? this.overviewContainer?.nativeElement
					: this.showZoomview
					? this.zoomviewContainer?.nativeElement
					: undefined
			) as HTMLElement,
			rect = target?.getBoundingClientRect(),
			clientX =
				event instanceof TouchEvent
					? event.touches.length
						? event.touches[0].clientX
						: event.changedTouches[0].clientX
					: (event as MouseEvent).clientX,
			offsetX = event instanceof TouchEvent ? clientX - rect.left : (event as MouseEvent).offsetX;

		return !rect || clientX <= rect.left
			? 0
			: clientX >= rect.left + target.clientWidth
			? 1
			: target.clientWidth
			? offsetX / target.clientWidth
			: this._player.currentTime / this._player.duration;
	}

	private getSeekTime(event: Event): number {
		return this.getSeekFactor(event) * this._player.duration;
	}

	protected containerOnDown(event: Event) {
		if (!this.seeking && (this.forceConnectGlobalAudioPlayer || !this.globalAudioPlayerService.playing)) {
			this.seeking = true;
			this.connectToGlobalAudioPlayer(false).then(() => {
				this.globalAudioPlayer?.seekEvent({
					time: this.getSeekTime(event),
					type: 'down',
				} as SeekbarSeekEventInterface);
			});
		}
	}

	@HostListener('document:mousemove', ['$event'])
	@HostListener('document:touchmove', ['$event'])
	protected containerOnMove(event: Event) {
		if (this.seeking)
			this.globalAudioPlayer?.seekEvent({
				time: this.getSeekTime(event),
				type: 'move',
			} as SeekbarSeekEventInterface);
	}

	@HostListener('document:mouseup', ['$event'])
	@HostListener('document:touchend', ['$event'])
	@HostListener('document:touchcancel', ['$event'])
	protected containerOnUp(event: Event) {
		if (this.seeking) {
			this.seeking = false;
			this.globalAudioPlayer?.seekEvent({
				time: this.getSeekTime(event),
				type: 'up',
			} as SeekbarSeekEventInterface);
		}
	}

	private setupAudioPlayer() {
		this._player.preload = 'metadata';
		this._player.addEventListener('play', async () => {
			this.play$.emit();
			await this.connectToGlobalAudioPlayer(false);
		});
	}

	private resetAudioPlayer(newPlayer: HTMLAudioElement = new Audio()) {
		this._player.pause();
		this._player.src = '';

		this._player = newPlayer;
		if (newPlayer.currentSrc && this._player.src !== newPlayer.currentSrc) this._player.src = newPlayer.currentSrc;
		this.setupAudioPlayer();
	}

	async connectToGlobalAudioPlayer(sync: boolean = true): Promise<boolean | null> {
		if (this.projectVersion) {
			if (this.connectedToGlobalAudioPlayer) {
				if (sync) await this.syncToGlobalAudioPlayer();
				this.updateGlobalAudioPlayerVisibility();
				return true;
			} else {
				this.globalAudioPlayerService.setSource(this.projectVersion, this.projectVersion ? this._player : undefined);
				this.updateGlobalAudioPlayerVisibility();
				return false;
			}
		} else return null;
	}

	private async syncToGlobalAudioPlayer() {
		if (this.globalAudioPlayer?.player.src) this.resetAudioPlayer(this.globalAudioPlayer.player);
		await this.initPeaks();
	}

	updateGlobalAudioPlayerVisibility() {
		this.globalAudioPlayerService.visible = this.globalAudioPlayerVisibleOnSync && this.connectedToGlobalAudioPlayer;
	}

	async updateSize(container: ElementRef<HTMLElement> | HTMLElement | number | undefined = this.container) {
		if (container) {
			await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
			const width: number =
				container instanceof ElementRef
					? container.nativeElement.clientWidth
					: container instanceof HTMLElement
					? container.clientWidth
					: Number.isInteger(container)
					? container
					: 0;

			if (this.zoomviewContainer) {
				this.zoomviewContainer.nativeElement.style.width = width + 'px';
				this._peaks?.views.getView('zoomview')?.fitToContainer();
			}

			if (this.overviewContainer) {
				this.overviewContainer.nativeElement.style.width = width + 'px';
				this._peaks?.views.getView('overview')?.fitToContainer();
			}
		}
	}

	private initPeaks() {
		return new Promise<boolean>(async (resolve) => {
			if (this.active) {
				if (this.projectVersion?.waveformURL)
					Peaks.init(
						{
							zoomview: {
								container: this.showZoomview ? this.zoomviewContainer?.nativeElement : null,
								wheelMode: 'scroll',
							},
							overview: {
								container: this.showOverview ? this.overviewContainer?.nativeElement : null,
								waveformColor: '#c9c9c9',
								playedWaveformColor: '#444',
							},
							mediaElement: this._player,
							dataUri: {
								arraybuffer: this.projectVersion.waveformURL,
							},
						} as PeaksOptions,
						async (err, peaks) => {
							if (err) {
								console.error(err.message);
								resolve(await this.retry());
							} else {
								this.destroy();
								this._peaks = peaks;

								if (this._peaks) {
									// TODO: maybe global-audio-player need to be updated after seek?
									//this.peaks.on('player.seeked', (time: number) => {
									//  this.globalAudioPlayerService.seekEvent({ time });
									//});
									this._peaks.on('peaks.ready', () => {
										this.peaksReady$.emit();
										resolve(true);
									});
								} else resolve(true);
							}
						},
					);
				else resolve(await this.retry());
			} else {
				this.destroy(true);
				resolve(false);
			}
		});
	}

	private async retry() {
		await new Promise<void>((resolve) => {
			this.retryTimeout = setTimeout(() => resolve(), Retry.Timeout) as unknown as number;
		});

		this.retries++;
		if (this.retries * Retry.Timeout >= Retry.Duration) return false;

		return await this.initPeaks();
	}

	private resetRetryCycle() {
		clearTimeout(this.retryTimeout);
		this.retries = 0;
	}

	private selectAudioSource(files: VersionFileInterface[], prefer?: string): VersionFileInterface | undefined {
		return prefer ? files.find(({ type }) => type === prefer) || files[0] : files[0];
	}

	private fetchAudioURL() {
		return new Promise<string | null>((resolve) => {
			if (!this.projectVersion) return resolve(null);

			const hash = this.selectAudioSource(this.projectVersion.files, 'wav')?.hash;
			if (!hash) return resolve(null);

			this.waveformPlayerService.getAudioURL('wav', hash).subscribe((result) => {
				if (!result.success) {
					console.error('could not load waveform-player audio:', result.reason);
					resolve(null);
				} else resolve(result.url ? (this._player.src = result.url) : null);
			});
		});
	}

	seekToMarker(marker: { start: number }) {
		this._player.currentTime = marker.start;
	}

	protected destroy(clearAudioSrc: boolean = false) {
		this._peaks?.destroy();
		this._peaks?.views.destroyZoomview();
		this._peaks?.views.destroyOverview();
		if (clearAudioSrc) this.resetAudioPlayer();
	}
}
