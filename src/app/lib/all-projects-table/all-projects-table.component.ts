import { Component, ElementRef, HostListener, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Project as ProjectInterface } from '../../interfaces/project.interface';
import { ProjectService } from '../../services/project.service';
import { ROLE_ICON } from '../../shared/roleIcon';
import { WaveformPlayerControlsSmallComponent } from '../waveform-player/waveform-player-controls-small/waveform-player-controls-small.component';
import { WaveformPlayerComponent } from '../waveform-player/waveform-player.component';

@Component({
	selector: 'app-all-projects-table',
	templateUrl: './all-projects-table.component.html',
	styleUrls: ['./all-projects-table.component.scss'],
})
export class AllProjectsTableComponent {
	protected readonly ROLE_ICON = ROLE_ICON;

	@Input() projects: ProjectInterface[] = [];

	@Input() loading: boolean = false;

	@ViewChild('container') protected container?: ElementRef<HTMLElement>;
	@ViewChildren(WaveformPlayerControlsSmallComponent)
	protected waveformPlayerControlsSmallComponents?: QueryList<WaveformPlayerControlsSmallComponent>;

	constructor(protected readonly projectService: ProjectService) {}

	@HostListener('window:resize')
	onResize() {
		this.waveformPlayerControlsSmallComponents?.forEach((waveformPlayerControlsSmallComponent) => {
			if (this.container?.nativeElement)
				waveformPlayerControlsSmallComponent.waveformPlayer?.updateSize(
					this.container?.nativeElement.clientWidth / 1.15,
				);
		});
	}

	pauseAll(except?: WaveformPlayerComponent) {
		this.waveformPlayerControlsSmallComponents?.forEach(
			(waveformPlayerControlsSmallComponent: WaveformPlayerControlsSmallComponent) => {
				if (waveformPlayerControlsSmallComponent.waveformPlayer !== except)
					waveformPlayerControlsSmallComponent.waveformPlayer?.globalAudioPlayer?.pause();
			},
		);
	}
}
