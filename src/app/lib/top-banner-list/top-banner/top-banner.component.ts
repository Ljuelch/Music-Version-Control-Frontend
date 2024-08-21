import { Component, Input } from '@angular/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { TopBanner as TopBannerInterface } from '../../../interfaces/topBanner.interface';

@Component({
	selector: 'app-top-banner',
	templateUrl: './top-banner.component.html',
	styleUrls: ['./top-banner.component.scss'],
})
export class TopBannerComponent {
	protected readonly DEFAULT_ICON = 'info';

	@Input() banner!: TopBannerInterface;

	protected get progressBarMode(): ProgressBarMode {
		return this.banner.progress === null ? 'indeterminate' : 'buffer';
	}

	protected get progressBarValue(): number {
		return this.banner.progress ? this.banner.progress * 100 : 0;
	}

	protected actionClick() {
		if (this.banner.action) this.banner.action(this.banner);
	}
}
