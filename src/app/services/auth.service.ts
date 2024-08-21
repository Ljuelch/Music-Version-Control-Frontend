import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getApiUrl } from '../../config';
import { Response as ResponseInterface } from '../interfaces/abstract/response.interface';
import { CookieService } from './cookie.service';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	constructor(
		private readonly http: HttpClient,
		private readonly cookieService: CookieService,
	) {
		this.updateSessionCookieInterval();
	}

	private updateSessionCookieInterval() {
		if (this.cookieService.isCookieSet('session'))
			this.cookieService.setCookie('session', this.cookieService.getCookie('session'), true);

		setTimeout(() => this.updateSessionCookieInterval(), 5e3);
	}

	isSessionActive(): boolean {
		return this.cookieService.isCookieSet('session');
	}

	get loggedIn(): Promise<boolean> {
		return new Promise<boolean>((resolve) =>
			this.http
				.get<ResponseInterface>(getApiUrl.apiUrl + '/auth/validateSession', { withCredentials: true })
				.subscribe(({ success }) => resolve(success)),
		);
	}
}
