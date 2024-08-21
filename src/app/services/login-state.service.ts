import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class LoginStateService {
	private showLogin: boolean = false;
	getShowLogin(): boolean {
		return this.showLogin;
	}

	setShowLogin(value: boolean): void {
		this.showLogin = value;
	}
}
