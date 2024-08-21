import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardHeaderSelfComponent } from './dashboard-header-self.component';

describe('DashboardHeaderSelfComponent', () => {
	let component: DashboardHeaderSelfComponent;
	let fixture: ComponentFixture<DashboardHeaderSelfComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [DashboardHeaderSelfComponent],
		});
		fixture = TestBed.createComponent(DashboardHeaderSelfComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
