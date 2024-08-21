import { Component } from '@angular/core';
import { GlobalAudioPlayerService } from '../../../services/global-audio-player.service';

@Component({
	selector: 'app-global-audio-player-space',
	template: '<div [style]="\'height:\'+bottomSpace"></div>',
	styleUrls: ['./global-audio-player-space.component.scss'],
})
export class GlobalAudioPlayerSpaceComponent {
	constructor(private readonly service: GlobalAudioPlayerService) {}

	protected get bottomSpace(): string {
		return this.service.visible && this.service.playerHeightPx !== undefined ? this.service.playerHeightPx + 'px' : '0';
	}
}
