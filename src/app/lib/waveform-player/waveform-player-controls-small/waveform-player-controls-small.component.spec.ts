import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveformPlayerControlsSmallComponent } from './waveform-player-controls-small.component';

describe('WaveformPlayerControlsSmallComponent', () => {
	let component: WaveformPlayerControlsSmallComponent;
	let fixture: ComponentFixture<WaveformPlayerControlsSmallComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [WaveformPlayerControlsSmallComponent],
		});
		fixture = TestBed.createComponent(WaveformPlayerControlsSmallComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
