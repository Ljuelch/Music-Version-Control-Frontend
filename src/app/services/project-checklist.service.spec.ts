import { TestBed } from '@angular/core/testing';

import { ProjectChecklistService } from './project-checklist.service';

describe('ProjectChecklistService', () => {
	let service: ProjectChecklistService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(ProjectChecklistService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
