import { Component } from '@angular/core';
import { LoginStateService } from '../../services/login-state.service';

@Component({
	selector: 'app-body',
	templateUrl: './body.component.html',
})
export class BodyComponent {
	constructor(private readonly loginStateService: LoginStateService) {}

	get showLogin(): boolean {
		return this.loginStateService.getShowLogin();
	}
}
