import { EventEmitter, Injectable, OnChanges, SimpleChanges } from '@angular/core';
import { SeekbarSeekEvent as SeekbarSeekEventInterface } from '../interfaces/action/seekbarSeekEvent.interface';
import { ProjectVersion as ProjectVersionInterface } from '../interfaces/projectVersion.interface';
import { GlobalAudioPlayerStutterService } from './global-audio-player-stutter.service';

export enum JumpAmount {
	Small = 1e3, // 1s
	Mid = 5 * 1e3, // 5s
	Big = 10 * 1e3, // 10s
}

@Injectable({
	providedIn: 'root',
})
export class GlobalAudioPlayerService implements OnChanges {
	private readonly selfPlayer: HTMLAudioElement = new Audio();
	private _player: HTMLAudioElement = this.selfPlayer;
	private _projectVersion?: ProjectVersionInterface;

	playerHeightPx?: number;

	private _visible: boolean = true;
	private _playing: boolean = false;

	readonly update$ = new EventEmitter<void>();
	readonly seek$ = new EventEmitter<SeekbarSeekEventInterface>();

	get projectVersion(): ProjectVersionInterface | undefined {
		return this._projectVersion;
	}

	get player(): HTMLAudioElement {
		return this._player;
	}

	get visible(): boolean {
		return !!(this._visible && this._projectVersion && this._player);
	}

	set visible(visible: boolean) {
		this._visible = visible;
	}

	get playerDuration(): number {
		return isNaN(this._player.duration) ? 0 : this._player.duration;
	}

	constructor(public readonly stutterService: GlobalAudioPlayerStutterService) {}

	ngOnChanges(changes: SimpleChanges) {
		if ((changes['_projectVersion'] && !this._projectVersion) || (changes['_player'] && !this._player))
			this.setSource();
		if (changes['_playing']) {
			if (this._playing && this._player.paused) this.play();
			else if (!this._playing && !this._player.paused) this.pause();
		}
	}

	getJumpAmountByKeyboardEvent(event: KeyboardEvent): JumpAmount {
		return event.ctrlKey ? JumpAmount.Small : event.shiftKey ? JumpAmount.Big : JumpAmount.Mid;
	}

	setSource(projectVersion?: ProjectVersionInterface, player?: HTMLAudioElement) {
		const changed = projectVersion !== this._projectVersion;
		this._projectVersion = projectVersion;
		if (player && player !== this._player) {
			this.pause();
			this._player = projectVersion && player ? player : this.selfPlayer;
		}
		if (changed) this.update$.emit();
	}

	seekEvent(event: SeekbarSeekEventInterface) {
		switch (event.type) {
			case 'down':
				this.stutterService.currentTime = event.time;
				this.stutterService.setPlayer(this.player).start();
				break;

			case 'move':
				this.stutterService.currentTime = event.time;
				break;

			case 'up':
				this.stutterService.stop().then();
				break;
		}

		this.seek$.emit(event);
	}

	get playing(): boolean {
		return !!this._player && !this._player.paused;
	}

	play() {
		void this._player.play();
	}

	pause() {
		this._player.pause();
	}

	stop() {
		this.pause();
		this._player.currentTime = 0;
	}

	toggle() {
		if (this.playing) this.pause();
		else this.play();
	}

	jump(timeAmount: number) {
		this._player.currentTime += timeAmount / 1e3;
	}
}
