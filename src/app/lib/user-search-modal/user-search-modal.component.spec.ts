import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserSearchModalComponent } from './user-search-modal.component';

describe('UserSearchModalComponent', () => {
	let component: UserSearchModalComponent;
	let fixture: ComponentFixture<UserSearchModalComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [UserSearchModalComponent],
		});
		fixture = TestBed.createComponent(UserSearchModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
