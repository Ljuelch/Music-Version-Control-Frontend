import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { InvalidSession as InvalidSessionInterface } from '../interfaces/api/invalidSession.interface';
import { LoginService } from './login.service';

@Injectable({
	providedIn: 'root',
})
export class ApiInterceptorService {
	private readonly ignore: RegExp[] = [];

	constructor(
		private readonly router: Router,
		private readonly loginService: LoginService,
	) {}

	handleEvent(event?: HttpResponse<unknown>) {
		if (event instanceof HttpResponse) {
			const body = event.body as InvalidSessionInterface;
			if (
				body &&
				!body.success &&
				body.reason === 'INVALID_SESSION' &&
				!this.ignore.some((path) => path.test(this.router.url))
			)
				this.loginService.logout();
		}
	}

	addIgnore(path: RegExp) {
		if (!this.ignore.includes(path)) this.ignore.push(path);
	}
}
