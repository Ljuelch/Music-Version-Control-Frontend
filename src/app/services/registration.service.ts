import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getApiUrl } from '../../config';
import { RegisterUser as RegisterUserInterface } from '../interfaces/action/registerUser.interface';
import { RegisterUser as RegisterUserResponseInterface } from '../interfaces/api/registerUser.interface';

@Injectable({
	providedIn: 'root',
})
export class RegistrationService {
	constructor(private readonly http: HttpClient) {}

	registerUser(userData: RegisterUserInterface): Observable<RegisterUserResponseInterface> {
		return this.http.post<RegisterUserResponseInterface>(getApiUrl.apiUrl + '/user/register', userData);
	}
}
