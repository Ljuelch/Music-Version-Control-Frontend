import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveformPlayerControlsLargeComponent } from './waveform-player-controls-large.component';

describe('WaveformPlayerControlsLargeComponent', () => {
	let component: WaveformPlayerControlsLargeComponent;
	let fixture: ComponentFixture<WaveformPlayerControlsLargeComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [WaveformPlayerControlsLargeComponent],
		});
		fixture = TestBed.createComponent(WaveformPlayerControlsLargeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
