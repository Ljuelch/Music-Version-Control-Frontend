import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Project as ProjectInterface } from '../../interfaces/project.interface';
import { GlobalAudioPlayerService } from '../../services/global-audio-player.service';
import { ProjectService } from '../../services/project.service';
import { SeekbarComponent } from './seekbar/seekbar.component';

const SEEKBAR_VALUE_FRACTION_DIGITS: number = 2; // X.xx

@Component({
	selector: 'app-global-audio-player',
	templateUrl: './global-audio-player.component.html',
	styleUrls: ['./global-audio-player.component.scss'],
})
export class GlobalAudioPlayerComponent implements OnInit {
	protected readonly seekbarStep = 1 / 10 ** SEEKBAR_VALUE_FRACTION_DIGITS;

	@ViewChild('overlayBox') private overlayBox?: ElementRef<HTMLElement>;
	@ViewChild(SeekbarComponent) private seekbarComponent?: SeekbarComponent;

	protected projectInfo?: ProjectInterface;

	protected get bottomPosition(): string {
		this.service.playerHeightPx = this.overlayBox?.nativeElement?.clientHeight;
		return this.service.visible ? '0' : this.service.playerHeightPx ? -this.service.playerHeightPx + 'px' : '-100px';
	}

	protected get controlsDisabled() {
		return this.service.stutterService.stuttering;
	}

	protected get playButtonPlaying(): boolean {
		return this.service.playing && this.service.stutterService.wasPlayingBefore !== false;
	}

	protected get seekbarValue(): number {
		return Math.min(
			this.seekbarMax,
			parseFloat(
				(this.service.stutterService.stuttering
					? this.service.stutterService
					: this.service.player
				).currentTime.toFixed(SEEKBAR_VALUE_FRACTION_DIGITS),
			),
		);
	}

	protected get seekbarMax(): number {
		return parseFloat(this.service.playerDuration.toFixed(SEEKBAR_VALUE_FRACTION_DIGITS));
	}

	constructor(
		protected readonly service: GlobalAudioPlayerService,
		protected readonly projectService: ProjectService,
	) {}

	ngOnInit() {
		this.service.update$.subscribe(async () => {
			await this.updateProjectInfo();
		});
		this.service.seek$.subscribe((event) => {
			this.seekbarComponent?.update(event.time);
		});
	}

	private isValidKeypress(event: KeyboardEvent): boolean {
		return event.target === document.body;
	}

	@HostListener('document:keydown.space', ['$event'])
	protected onKeySpace(event: KeyboardEvent) {
		if (this.isValidKeypress(event)) {
			this.service.toggle();
			event.preventDefault();
		}
	}

	@HostListener('document:keydown.arrowLeft', ['$event'])
	protected onKeyArrowLeft(event: KeyboardEvent) {
		if (this.isValidKeypress(event)) this.service.jump(-this.service.getJumpAmountByKeyboardEvent(event));
	}

	@HostListener('document:keydown.arrowRight', ['$event'])
	protected onKeyArrowRight(event: KeyboardEvent) {
		if (this.isValidKeypress(event)) this.service.jump(this.service.getJumpAmountByKeyboardEvent(event));
	}

	private updateProjectInfo() {
		return new Promise<void>((resolve) => {
			if (this.service.projectVersion?.id)
				this.projectService.getProjectInfoByVersionId(this.service.projectVersion.id).subscribe((info) => {
					this.projectInfo = info;
					resolve();
				});
		});
	}
}
