import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalAudioPlayerComponent } from './global-audio-player.component';

describe('GlobalAudioPlayerComponent', () => {
	let component: GlobalAudioPlayerComponent;
	let fixture: ComponentFixture<GlobalAudioPlayerComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [GlobalAudioPlayerComponent],
		});
		fixture = TestBed.createComponent(GlobalAudioPlayerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
