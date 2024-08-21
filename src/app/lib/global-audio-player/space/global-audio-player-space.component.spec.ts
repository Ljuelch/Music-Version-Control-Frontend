import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalAudioPlayerSpaceComponent } from './global-audio-player-space.component';

describe('GlobalAudioPlayerSpaceComponent', () => {
	let component: GlobalAudioPlayerSpaceComponent;
	let fixture: ComponentFixture<GlobalAudioPlayerSpaceComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [GlobalAudioPlayerSpaceComponent],
		});
		fixture = TestBed.createComponent(GlobalAudioPlayerSpaceComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
