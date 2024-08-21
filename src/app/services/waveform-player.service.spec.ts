import { TestBed } from '@angular/core/testing';

import { WaveformPlayerService } from './waveform-player.service';

describe('WaveformPlayerService', () => {
	let service: WaveformPlayerService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(WaveformPlayerService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
