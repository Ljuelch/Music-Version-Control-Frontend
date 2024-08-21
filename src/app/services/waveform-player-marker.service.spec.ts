import { TestBed } from '@angular/core/testing';

import { WaveformPlayerMarkerService } from './waveform-player-marker.service';

describe('WaveformPlayerMarkerService', () => {
	let service: WaveformPlayerMarkerService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(WaveformPlayerMarkerService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
