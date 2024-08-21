import { Injectable } from '@angular/core';
import { CookieService as NgxCookieService } from 'ngx-cookie-service';

@Injectable({
	providedIn: 'root',
})
export class CookieService {
	private readonly DOMAIN = window.location.hostname;
	private readonly API_DOMAIN = (window.location.hostname === 'localhost' ? '' : '.') + window.location.hostname;
	private readonly PATH = '/';

	constructor(private readonly ngxCookieService: NgxCookieService) {}

	private getDomain(api: boolean = false): string {
		return api ? this.API_DOMAIN : this.DOMAIN;
	}

	private getExpirationDate(days: number = 1): Date {
		const expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() + days);
		return expirationDate;
	}

	getCookie(name: string): string {
		return this.ngxCookieService.get(name);
	}

	isCookieSet(name: string): boolean {
		return !!this.getCookie(name);
	}

	setCookie(name: string, value: string, api: boolean = false, path: string = this.PATH, expirationDate?: Date) {
		this.ngxCookieService.set(name, value, {
			domain: this.getDomain(api),
			path: path,
			expires: expirationDate || this.getExpirationDate(),
		});
	}

	deleteCookie(name: string, api: boolean = false, path: string = this.PATH) {
		this.ngxCookieService.delete(name, path, this.getDomain(api));
	}
}
