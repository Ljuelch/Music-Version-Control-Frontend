import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllProjectsTableComponent } from './all-projects-table.component';

describe('AllProjectsTableComponent', () => {
	let component: AllProjectsTableComponent;
	let fixture: ComponentFixture<AllProjectsTableComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [AllProjectsTableComponent],
		});
		fixture = TestBed.createComponent(AllProjectsTableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
