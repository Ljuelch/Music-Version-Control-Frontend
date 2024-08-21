import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBannerComponent } from './top-banner.component';

describe('TopBannerComponent', () => {
	let component: TopBannerComponent;
	let fixture: ComponentFixture<TopBannerComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [TopBannerComponent],
		});
		fixture = TestBed.createComponent(TopBannerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
