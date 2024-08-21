import { TestBed } from '@angular/core/testing';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CookieServiceService } from './cookie.service';

describe('CookieServiceService', () => {
	let service: CookieServiceService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(CookieServiceService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
