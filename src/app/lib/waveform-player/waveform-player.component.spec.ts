import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveformPlayerComponent } from './waveform-player.component';

describe('WaveformPlayerComponent', () => {
	let component: WaveformPlayerComponent;
	let fixture: ComponentFixture<WaveformPlayerComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [WaveformPlayerComponent],
		});
		fixture = TestBed.createComponent(WaveformPlayerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
