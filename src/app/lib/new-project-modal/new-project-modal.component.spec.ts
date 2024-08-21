import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProjectModalComponent } from './new-project-modal.component';

describe('NewProjectModalComponent', () => {
	let component: NewProjectModalComponent;
	let fixture: ComponentFixture<NewProjectModalComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [NewProjectModalComponent],
		});
		fixture = TestBed.createComponent(NewProjectModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
