import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardHeaderUserComponent } from './dashboard-header-user.component';

describe('DashboardHeaderUserComponent', () => {
	let component: DashboardHeaderUserComponent;
	let fixture: ComponentFixture<DashboardHeaderUserComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [DashboardHeaderUserComponent],
		});
		fixture = TestBed.createComponent(DashboardHeaderUserComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
