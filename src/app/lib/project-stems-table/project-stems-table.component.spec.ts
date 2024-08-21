import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStemsTableComponent } from './project-stems-table.component';

describe('ProjectStemsTableComponent', () => {
	let component: ProjectStemsTableComponent;
	let fixture: ComponentFixture<ProjectStemsTableComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [ProjectStemsTableComponent],
		});
		fixture = TestBed.createComponent(ProjectStemsTableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
