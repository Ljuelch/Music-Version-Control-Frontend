import { Component, HostListener, ViewChild } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
	selector: 'app-nav-bar-dropdown',
	templateUrl: './nav-bar-dropdown.component.html',
	styleUrls: ['./nav-bar-dropdown.component.scss'],
})
export class NavBarDropdownComponent {
	@ViewChild('notificationDropdown') notificationDropdown?: NgbDropdown;
	@ViewChild('userDropdown') userDropdown?: NgbDropdown;

	constructor(
		protected readonly notificationService: NotificationService,
		private readonly authService: AuthService,
	) {}

	protected isSessionActive(): boolean {
		return this.authService.isSessionActive();
	}

	@HostListener('window:scroll')
	closeAllDrowdowns() {
		this.notificationDropdown?.close();
		this.userDropdown?.close();
	}
}
