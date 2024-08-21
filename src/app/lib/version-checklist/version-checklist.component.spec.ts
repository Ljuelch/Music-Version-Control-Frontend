import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionChecklistComponent } from './version-checklist.component';

describe('VersionChecklistComponent', () => {
	let component: VersionChecklistComponent;
	let fixture: ComponentFixture<VersionChecklistComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [VersionChecklistComponent],
		});
		fixture = TestBed.createComponent(VersionChecklistComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
