import { TestBed } from '@angular/core/testing';

import { GlobalAudioPlayerService } from './global-audio-player.service';

describe('GlobalAudioPlayerService', () => {
	let service: GlobalAudioPlayerService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(GlobalAudioPlayerService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
