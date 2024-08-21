import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ProjectVersion as ProjectVersionInterface } from '../../../interfaces/projectVersion.interface';
import { WaveformPlayerComponent } from '../waveform-player.component';

@Component({
	selector: 'app-waveform-player-controls-small',
	templateUrl: './waveform-player-controls-small.component.html',
	styleUrls: ['./waveform-player-controls-small.component.scss'],
})
export class WaveformPlayerControlsSmallComponent {
	@Input() projectVersion?: ProjectVersionInterface;
	@Input() playerClass?: string;

	@Output() readonly play$ = new EventEmitter<WaveformPlayerComponent>();

	@ViewChild(WaveformPlayerComponent) waveformPlayer?: WaveformPlayerComponent;

	protected get playButtonPlaying(): boolean {
		return !!(
			this.waveformPlayer &&
			this.waveformPlayer.globalAudioPlayer?.playing &&
			this.waveformPlayer.globalAudioPlayer?.stutterService.wasPlayingBefore !== false
		);
	}

	protected get playButtonDisabled(): boolean {
		return !!(
			!this.waveformPlayer ||
			!this.waveformPlayer.active ||
			this.waveformPlayer.loading ||
			(this.waveformPlayer.globalAudioPlayer && this.waveformPlayer.globalAudioPlayer.stutterService.stuttering)
		);
	}
}
