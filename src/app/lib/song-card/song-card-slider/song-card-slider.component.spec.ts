import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongCardSliderComponent } from './song-card-slider.component';

describe('SongCardSliderComponent', () => {
	let component: SongCardSliderComponent;
	let fixture: ComponentFixture<SongCardSliderComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [SongCardSliderComponent],
		});
		fixture = TestBed.createComponent(SongCardSliderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
