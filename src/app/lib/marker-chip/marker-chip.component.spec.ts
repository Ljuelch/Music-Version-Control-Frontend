import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerChipComponent } from './marker-chip.component';

describe('MarkerChipComponent', () => {
	let component: MarkerChipComponent;
	let fixture: ComponentFixture<MarkerChipComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [MarkerChipComponent],
		});
		fixture = TestBed.createComponent(MarkerChipComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
