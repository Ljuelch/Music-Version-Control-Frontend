import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionChangesTableComponent } from './version-changes-table.component';

describe('VersionChangesTableComponent', () => {
	let component: VersionChangesTableComponent;
	let fixture: ComponentFixture<VersionChangesTableComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [VersionChangesTableComponent],
		});
		fixture = TestBed.createComponent(VersionChangesTableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
