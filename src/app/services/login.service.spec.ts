import { TestBed } from '@angular/core/testing';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { LoginService } from './login.service';

describe('LoginService', () => {
	let service: LoginService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(LoginService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
