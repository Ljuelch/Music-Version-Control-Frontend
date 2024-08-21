import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { getApiUrl } from '../../config';
import { FollowUser as FollowUserInterface } from '../interfaces/api/followUser.interface';
import { GetUserInfo as GetUserInfoInterface } from '../interfaces/api/getUserInfo.interface';
import { UnfollowUser as UnfollowUserInterface } from '../interfaces/api/unfollowUser.interface';
import { User } from '../interfaces/user.interface';

@Injectable({
	providedIn: 'root',
})
export class UserInfoService {
	constructor(
		private readonly http: HttpClient,
		private readonly router: Router,
	) {}

	async gotoUser(user_id: number) {
		await this.router.navigate(['/user', user_id]);
	}

	async gotoDashboard() {
		await this.router.navigate(['/dashboard']);
	}

	getUserInfo(user_id?: number): Observable<GetUserInfoInterface> {
		return this.http.get<GetUserInfoInterface>(getApiUrl.apiUrl + '/user/info', {
			params: user_id ? { id: user_id } : {},
			withCredentials: true,
		});
	}

	followUser(user_id: number): Observable<FollowUserInterface> {
		return this.http.post<FollowUserInterface>(
			getApiUrl.apiUrl + '/user/follow',
			{
				followUserId: user_id,
			},
			{ withCredentials: true },
		);
	}

	unfollowUser(user_id: number): Observable<UnfollowUserInterface> {
		return this.http.post<UnfollowUserInterface>(
			getApiUrl.apiUrl + '/user/unfollow',
			{
				unfollowUserId: user_id,
			},
			{ withCredentials: true },
		);
	}

	updateUserInformation(userData: GetUserInfoInterface): Observable<User> {
		return this.http.patch<User>(getApiUrl.apiUrl + '/user/info', userData, {
			withCredentials: true,
		});
	}
}
