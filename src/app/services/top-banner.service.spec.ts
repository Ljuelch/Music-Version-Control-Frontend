import { TestBed } from '@angular/core/testing';

import { TopBannerService } from './top-banner.service';

describe('TopBannerService', () => {
	let service: TopBannerService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(TopBannerService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
