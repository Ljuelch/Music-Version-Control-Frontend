import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProjectVersionModalComponent } from './new-project-version-modal.component';

describe('NewProjectVersionModalComponent', () => {
	let component: NewProjectVersionModalComponent;
	let fixture: ComponentFixture<NewProjectVersionModalComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [NewProjectVersionModalComponent],
		});
		fixture = TestBed.createComponent(NewProjectVersionModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
