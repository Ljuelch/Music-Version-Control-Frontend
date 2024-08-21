import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiInterceptorService } from '../../services/api-interceptor.service';

@Component({
	selector: 'app-startpage',
	templateUrl: './startpage.component.html',
	styleUrls: ['./startpage.component.scss'],
})
export class StartpageComponent implements OnInit {
	constructor(
		private readonly router: Router,
		private readonly apiInterceptorService: ApiInterceptorService,
	) {}

	async ngOnInit() {
		this.apiInterceptorService.addIgnore(/^\/$/);
		await this.router.navigate(['/login']);
	}
}
