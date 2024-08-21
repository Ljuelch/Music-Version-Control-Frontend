import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectContributorsTableComponent } from './project-contributors-table.component';

describe('ProjectContributorsTableComponent', () => {
	let component: ProjectContributorsTableComponent;
	let fixture: ComponentFixture<ProjectContributorsTableComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [ProjectContributorsTableComponent],
		});
		fixture = TestBed.createComponent(ProjectContributorsTableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
