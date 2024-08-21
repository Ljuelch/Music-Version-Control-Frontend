import { TestBed } from '@angular/core/testing';

import { StemsService } from './stems.service';

describe('StemsService', () => {
	let service: StemsService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(StemsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
