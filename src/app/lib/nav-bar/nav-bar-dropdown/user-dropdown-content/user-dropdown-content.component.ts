import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../../services/login.service';

@Component({
	selector: 'app-user-dropdown-content',
	templateUrl: './user-dropdown-content.component.html',
	styleUrls: ['./user-dropdown-content.component.scss'],
})
export class UserDropdownContentComponent {
	constructor(
		private readonly loginService: LoginService,
		private readonly router: Router,
	) {}

	protected logout() {
		this.loginService.logout();
	}

	userSettings() {
		this.router.navigate(['/user-settings']).then();
	}
}
