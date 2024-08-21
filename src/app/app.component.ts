import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { FaviconService } from './services/favicon.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
	isOnHome: boolean = false;

	constructor(
		private readonly router: Router,
		private readonly renderer: Renderer2,
		private readonly faviconService: FaviconService,
	) {}

	ngOnInit() {
		this.faviconService.startFaviconUpdateInterval(this.renderer);

		this.router.events.subscribe((event) => {
			const url = (event as { url: string }).url;
			if (url) this.isOnHome = url.startsWith('/dashboard');
		});
	}
}
