import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getApiUrl } from '../../config';
import { EvaluateResetPasswordKey as EvaluateResetPasswordKeyInterface } from '../interfaces/api/evaluateResetPasswordKey.interface';
import { RequestPasswordReset as RequestPasswordResetInterface } from '../interfaces/api/requestPasswordReset.interface';
import { ResetPassword as ResetPasswordInterface } from '../interfaces/api/resetPassword.interface';

@Injectable({
	providedIn: 'root',
})
export class ResetPasswordService {
	constructor(private readonly http: HttpClient) {}

	requestPasswordReset(email?: string): Observable<RequestPasswordResetInterface> {
		return this.http.post<RequestPasswordResetInterface>(
			getApiUrl.apiUrl + '/reset-password',
			{ email },
			{ withCredentials: true },
		);
	}

	evaluateKey(key: string): Observable<EvaluateResetPasswordKeyInterface> {
		return this.http.post<EvaluateResetPasswordKeyInterface>(getApiUrl.apiUrl + '/reset-password/evaluate', { key });
	}

	resetPassword(key: string, password: string): Observable<ResetPasswordInterface> {
		return this.http.patch<ResetPasswordInterface>(getApiUrl.apiUrl + '/reset-password', { key, password });
	}
}
