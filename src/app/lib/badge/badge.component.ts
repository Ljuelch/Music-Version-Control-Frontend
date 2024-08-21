import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-badge',
	templateUrl: './badge.component.html',
	styleUrls: ['./badge.component.scss'],
})
export class BadgeComponent {
	@Input() content: string = '';
	@Input() style: string = 'top:0';
	@Input() disablePointerEvents: boolean = true;
	@Input() hideOn0: boolean = false;
}
