import { Injectable, Renderer2 } from '@angular/core';
import { BrowserColorScheme } from '../interfaces/types/browserColorScheme.type';
import { FaviconColorScheme } from '../interfaces/types/faviconColorScheme.type';
import { BrowserService } from './browser.service';

@Injectable({
	providedIn: 'root',
})
export class FaviconService {
	private readonly LINK_SELECTOR = 'link[rel="icon"]';
	readonly PATH = 'assets/favicon';
	readonly FILE_EXTENSION = 'ico';

	readonly UPDATE_INTERVAL_MS = 4e3; // 4s

	constructor(private readonly browserService: BrowserService) {}

	private getFilePath(faviconColorScheme: FaviconColorScheme): string {
		return this.PATH + '/' + faviconColorScheme + '.' + this.FILE_EXTENSION;
	}

	private fromBrowserColorScheme(browserColorScheme: BrowserColorScheme): FaviconColorScheme {
		return <FaviconColorScheme>{
			/* bcs: fcs */
			light: 'dark',
			dark: 'light',
		}[browserColorScheme];
	}

	setFavicon(
		renderer: Renderer2,
		colorScheme: FaviconColorScheme = this.fromBrowserColorScheme(this.browserService.colorScheme),
	) {
		renderer.setAttribute(renderer.selectRootElement(this.LINK_SELECTOR), 'href', this.getFilePath(colorScheme));
	}

	startFaviconUpdateInterval(renderer: Renderer2, ms: number = this.UPDATE_INTERVAL_MS): number {
		return setInterval(() => this.setFavicon(renderer), ms) as unknown as number;
	}
}
