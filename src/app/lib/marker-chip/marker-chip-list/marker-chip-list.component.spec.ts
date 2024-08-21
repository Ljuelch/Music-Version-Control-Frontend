import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerChipListComponent } from './marker-chip-list.component';

describe('MarkerChipListComponent', () => {
	let component: MarkerChipListComponent;
	let fixture: ComponentFixture<MarkerChipListComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [MarkerChipListComponent],
		});
		fixture = TestBed.createComponent(MarkerChipListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
