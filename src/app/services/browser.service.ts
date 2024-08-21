import { Injectable } from '@angular/core';
import { BrowserColorScheme } from '../interfaces/types/browserColorScheme.type';

@Injectable({
	providedIn: 'root',
})
export class BrowserService {
	get colorScheme(): BrowserColorScheme {
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}
}
