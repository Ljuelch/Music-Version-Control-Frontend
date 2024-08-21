import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationDropdownContentComponent } from './notification-dropdown-content.component';

describe('NotificationDropdownContentComponent', () => {
	let component: NotificationDropdownContentComponent;
	let fixture: ComponentFixture<NotificationDropdownContentComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [NotificationDropdownContentComponent],
		});
		fixture = TestBed.createComponent(NotificationDropdownContentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
