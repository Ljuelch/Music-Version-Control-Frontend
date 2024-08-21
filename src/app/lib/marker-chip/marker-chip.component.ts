import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-marker-chip',
	templateUrl: './marker-chip.component.html',
	styleUrls: ['./marker-chip.component.scss'],
})
export class MarkerChipComponent {
	@Input() content!: number | string;
	@Input() color: string = '#ddd';
	@Input() icon: string = 'filter';

	private splitTime(time: number) {
		const sec = time % 3600;
		return {
			h: Math.floor(time / 3600),
			m: Math.floor(sec / 60),
			s: Math.floor(sec % 60),
		};
	}

	private formatTime(time: number): string {
		const { h, m, s } = this.splitTime(time);
		return (h ? h + ':' : '') + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
	}

	protected get innerHtml() {
		return typeof this.content === 'string'
			? this.content
			: this.content === undefined
			? ''
			: this.formatTime(this.content!);
	}
}
