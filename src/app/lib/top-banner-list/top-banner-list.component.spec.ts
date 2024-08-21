import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBannerListComponent } from './top-banner-list.component';

describe('TopBannerListComponent', () => {
	let component: TopBannerListComponent;
	let fixture: ComponentFixture<TopBannerListComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [TopBannerListComponent],
		});
		fixture = TestBed.createComponent(TopBannerListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
