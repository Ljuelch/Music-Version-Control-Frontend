import { Component, OnInit } from '@angular/core';
import { TopBanner as TopBannerInterface } from '../../interfaces/topBanner.interface';
import { TopBannerService } from '../../services/top-banner.service';

@Component({
	selector: 'app-top-banner-list',
	templateUrl: './top-banner-list.component.html',
})
export class TopBannerListComponent implements OnInit {
	protected banners: TopBannerInterface[] = [];

	constructor(private readonly topBannerService: TopBannerService) {}

	ngOnInit() {
		this.topBannerService.banners$.subscribe((banners) => {
			this.banners = banners;
		});
	}
}
