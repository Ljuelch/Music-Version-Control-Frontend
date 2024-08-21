import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { getApiUrl } from '../../config';
import { User as UserInterface } from '../interfaces/user.interface';

@Injectable({
	providedIn: 'root',
})
export class UserSearchService {
	private cancelSearchRequest$: Subject<void> = new Subject<void>();

	constructor(private readonly http: HttpClient) {}

	search(query: string): Observable<UserInterface[]> {
		const request = this.http.get<UserInterface[]>(getApiUrl.apiUrl + '/user/search', {
			withCredentials: true,
			params: { query },
		});
		request.pipe(takeUntil(this.cancelSearchRequest$)).subscribe();
		return request;
	}

	cancelSearchRequest() {
		this.cancelSearchRequest$.next();
	}
}
