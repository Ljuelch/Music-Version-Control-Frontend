import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { getApiUrl } from '../../config';
import { AuthLogin as AuthLoginInterface } from '../interfaces/api/authLogin.interface';
import { Login as LoginInterface } from '../interfaces/action/login.interface';
import { CookieService } from './cookie.service';

@Injectable({
	providedIn: 'root',
})
export class LoginService {
	constructor(
		private readonly http: HttpClient,
		private readonly router: Router,
		private readonly cookieService: CookieService,
	) {}

	login(loginData: LoginInterface) {
		return this.http.post<AuthLoginInterface>(getApiUrl.apiUrl + '/auth/login', loginData).pipe(
			catchError((error) => {
				console.error('Login error:', error);
				return throwError(error);
			}),
		);
	}

	logout() {
		this.cookieService.deleteCookie('session', true);
		this.router.navigate(['/login']).then();
	}
}
