import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../services/notification.service';

@Component({
	selector: 'app-notification-dropdown-content',
	templateUrl: './notification-dropdown-content.component.html',
	styleUrls: ['./notification-dropdown-content.component.scss'],
})
export class NotificationDropdownContentComponent {
	constructor(
		private readonly router: Router,
		protected readonly notificationService: NotificationService,
	) {}

	protected gotoNotifications() {
		this.router.navigate(['/notifications']).then();
	}
}
