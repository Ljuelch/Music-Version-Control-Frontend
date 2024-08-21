import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDropdownContentComponent } from './user-dropdown-content.component';

describe('UserDropdownContentComponent', () => {
  let component: UserDropdownContentComponent;
  let fixture: ComponentFixture<UserDropdownContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserDropdownContentComponent]
    });
    fixture = TestBed.createComponent(UserDropdownContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
