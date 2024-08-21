import {
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnChanges,
	OnInit,
	Output,
	QueryList,
	SimpleChanges,
	ViewChild,
	ViewChildren,
} from '@angular/core';
import { MarkerListMarkerClick as MarkerListMarkerClickInterface } from '../../../interfaces/action/markerListMarkerClick.interface';
import { MarkerListAction as MarkerListActionInterface } from '../../../interfaces/markerListAction.interface';
import { MarkerListMarker as MarkerListMarkerInterface } from '../../../interfaces/markerListMarker.interface';
import { ProjectChecklistEntryMarker as ProjectChecklistEntryMarkerInterface } from '../../../interfaces/projectChecklistEntryMarker.interface';
import { ProjectVersion as ProjectVersionInterface } from '../../../interfaces/projectVersion.interface';
import { WaveformPlayerMarkerService } from '../../../services/waveform-player-marker.service';
import { MarkerChipListComponent } from '../../marker-chip/marker-chip-list/marker-chip-list.component';
import { WaveformPlayerComponent } from '../waveform-player.component';

@Component({
	selector: 'app-waveform-player-controls-large',
	templateUrl: './waveform-player-controls-large.component.html',
	styleUrls: ['./waveform-player-controls-large.component.scss'],
})
export class WaveformPlayerControlsLargeComponent implements OnInit, OnChanges {
	protected readonly MARKER_LIST_ACTIONS: MarkerListActionInterface[] = [
		{
			name: 'DELETE',
			content: `<i class="fa fa-trash"></i>`,
			class: 'hover-text-danger',
		},
		{
			name: 'COLOR',
			content: '<i class="fa fa-palette"></i>',
			type: 'COLOR',
			global: false,
		},
		{
			name: 'ADD_TO_CHECKLIST',
			content: `<i class="fa fa-arrow-right"></i><i class="fa fa-check-square fw-light"></i>`,
			class: 'text-nowrap',
		},
	];

	@Input() projectVersion?: ProjectVersionInterface;
	@Input() lastVersion?: ProjectVersionInterface;
	@Input() playerClass?: string;

	@Input() staticMarker: ProjectChecklistEntryMarkerInterface[] = [];

	@Input() controls: boolean = true;

	@Output() readonly play$ = new EventEmitter<void>();
	@Output() readonly addMarkerToChecklist$ = new EventEmitter<MarkerListMarkerInterface[]>();

	@ViewChild(WaveformPlayerComponent, { static: true }) waveformPlayer!: WaveformPlayerComponent;
	@ViewChildren('markerButton') protected markerButtons!: QueryList<ElementRef<HTMLElement>>;
	@ViewChild(MarkerChipListComponent, { static: true }) protected markerChipListComponent!: MarkerChipListComponent;
	@ViewChild('markerTextInput') protected markerTextInput?: ElementRef<HTMLInputElement>;

	protected get addMarkerButtonEnabled(): boolean {
		return !!(this.waveformPlayer?.peaks && this.projectVersion);
	}

	constructor(protected readonly waveformPlayerMarkerService: WaveformPlayerMarkerService) {}

	ngOnInit() {
		this.waveformPlayerMarkerService.change$.subscribe(() => {
			this.updateMarker();
		});
		this.waveformPlayer.peaksReady$.subscribe(() => {
			this.updateMarker();
		});
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['projectVersion']) {
			this.waveformPlayer.connectToGlobalAudioPlayer(false).then(() => {
				this.waveformPlayer!.updateGlobalAudioPlayerVisibility();
			});
			this.updateMarker();
		}
		if (changes['staticMarker']) this.updateMarker();
	}

	@HostListener('document:keydown.enter', ['$event'])
	protected onKeyEnter(event: KeyboardEvent) {
		if (this.isValidKeypress(event)) this.waveformPlayer.globalAudioPlayer?.stop();
	}

	@HostListener('document:keydown.m', ['$event'])
	protected onKeyEsc(event: KeyboardEvent) {
		if (this.isValidKeypress(event)) {
			this.markerTextInput?.nativeElement.blur();
			this.addMarker().then();
			this.markerTextInput?.nativeElement.focus();
			event.preventDefault();
		}
	}

	private updateMarker() {
		if (this.waveformPlayer?.peaks) {
			this.waveformPlayer.peaks.points.removeAll();
			for (const marker of this.staticMarker) {
				this.waveformPlayer.peaks.points.add({
					time: marker.start,
					color: '#' + marker.color,
				});
			}
			for (const marker of this.waveformPlayerMarkerService.getMarker(this.waveformPlayer.projectVersion!.id!))
				if (marker.id !== undefined && !this.waveformPlayer.peaks.points.getPoint(marker.id))
					this.waveformPlayer.peaks.points.add({
						id: marker.id,
						time: marker.start,
						color: '#' + marker.color,
					});
		}
	}

	private isValidKeypress(event: KeyboardEvent): boolean {
		return event.target === document.body;
	}

	protected async addMarker() {
		if (this.waveformPlayer?.peaks && this.projectVersion) {
			const marker = this.waveformPlayerMarkerService.addMarker(
				this.projectVersion.id!,
				this.waveformPlayer.player.currentTime,
			);
			this.markerChipListComponent.selectMarker(marker);
			this.markerTextInput!.nativeElement.value = this.markerChipListComponent.selectedMarker!.text || '';
			await this.blinkMarkerButton(marker.color);
		}
	}

	private async blinkMarkerButton(color: string) {
		const _color = (color.startsWith('#') ? '' : '#') + color;

		await Promise.all(
			this.markerButtons.map(
				({ nativeElement }) =>
					new Promise<void>(async (resolve) => {
						nativeElement.classList.remove('fading');
						await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

						nativeElement.style.color = _color;
						nativeElement.style.textShadow = '0 0 18px ' + _color;
						await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

						nativeElement.classList.add('fading');
						nativeElement.style.color = '';
						nativeElement.style.textShadow = '';
						await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

						resolve();
					}),
			),
		);
	}

	protected markerActionClick(clickAction: MarkerListMarkerClickInterface) {
		switch (clickAction.action.name) {
			case 'DELETE':
				this.deleteMarker(clickAction.marker);
				break;
			case 'ADD_TO_CHECKLIST':
				this.addMarkerToChecklistClick(clickAction.marker);
				break;
		}
	}

	protected addMarkerToChecklistClick(marker: MarkerListMarkerInterface[]) {
		this.addMarkerToChecklist$.emit(marker);
		this.markerChipListComponent.closeMarkerDropdown();
	}

	deleteMarker(marker: MarkerListMarkerInterface[]) {
		for (const _marker of marker) this.waveformPlayerMarkerService.removeMarker(_marker);
		this.markerChipListComponent.marker = this.waveformPlayerMarkerService.marker;
		this.markerChipListComponent.selectMarker(this.markerChipListComponent.marker[0]);
	}
}
