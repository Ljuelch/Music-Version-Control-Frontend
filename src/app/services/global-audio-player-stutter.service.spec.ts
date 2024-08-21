import { TestBed } from '@angular/core/testing';

import { GlobalAudioPlayerStutterService } from './global-audio-player-stutter.service';

describe('GlobalAudioPlayerStutterService', () => {
	let service: GlobalAudioPlayerStutterService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(GlobalAudioPlayerStutterService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
