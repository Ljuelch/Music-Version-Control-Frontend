import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthLogin as AuthLoginInterface } from '../../interfaces/api/authLogin.interface';
import { AuthService } from '../../services/auth.service';
import { CookieService } from '../../services/cookie.service';
import { LoginStateService } from '../../services/login-state.service';
import { LoginService } from '../../services/login.service';
import { TranslationService } from '../../services/translation.service';
import { UserInfoService } from '../../services/user-info.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	protected email: string = '';
	protected password: string = '';

	constructor(
		private readonly toastr: ToastrService,
		private readonly translationService: TranslationService,
		private readonly authService: AuthService,
		private readonly userInfoService: UserInfoService,
		private readonly loginService: LoginService,
		private readonly loginStateService: LoginStateService,
		private readonly cookieService: CookieService,
	) {}

	ngOnInit() {
		this.authService.loggedIn.then(async (loggedIn) => {
			if (loggedIn) await this.userInfoService.gotoDashboard();
		});
	}

	protected login() {
		this.loginService
			.login({
				login: this.email,
				password: this.password,
			})
			.subscribe(async (response: AuthLoginInterface) => {
				if (response.success && response.session) {
					this.cookieService.setCookie('session', response.session, true);
					this.loginStateService.setShowLogin(false);
					this.toastr.success(
						this.translationService.getTranslation('_toastr.login.success.message'),
						this.translationService.getTranslation('_toastr.login.success.title'),
					);
					await this.userInfoService.gotoDashboard();
				} else {
					console.error('Login failed:', response.reason);
					this.toastr.error(
						this.translationService.getTranslation('_toastr.login.error.message'),
						this.translationService.getTranslation('_toastr.login.error.title'),
					);
				}
			});
	}

	protected register() {
		this.loginStateService.setShowLogin(false);
	}

	protected gotoResetPassword() {
		this.loginStateService.setShowLogin(false);
	}
}
