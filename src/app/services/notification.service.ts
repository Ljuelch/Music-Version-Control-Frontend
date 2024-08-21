import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getApiUrl } from '../../config';
import { Response as ResponseInterface } from '../interfaces/abstract/response.interface';
import { GetUnreadNotificationCount as GetUnreadNotificationCountInterface } from '../interfaces/api/getUnreadNotificationCount.interface';
import { Notification as NotificationInterface } from '../interfaces/notification.interface';
import { NotificationFilter as NotificationFilterInterface } from '../interfaces/notificationFilter.interface';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root',
})
export class NotificationService {
	readonly NOTIFICATION_TIME_TYPE_NOW = 0;
	readonly NOTIFICATION_TIME_TYPE_TODAY = 1;
	readonly NOTIFICATION_TIME_TYPE_OLDER = 2;

	notifications: NotificationInterface[] = [];
	unreadNotificationCount?: number;

	constructor(
		private readonly http: HttpClient,
		private readonly authService: AuthService,
	) {
		this.notificationCountInterval().then();
	}

	private async notificationCountInterval() {
		if (await this.authService.loggedIn) {
			const unreadNotificationCount = Number(this.unreadNotificationCount);
			await this.fetchCountOfUnread();
			if (this.unreadNotificationCount !== unreadNotificationCount) this.updateNotifications().then();
		}
		setTimeout(() => this.notificationCountInterval(), 5e3);
	}

	getNotificationTimeType(notification: NotificationInterface) {
		const now = new Date();
		return notification.timestamp.getDate() === now.getDate()
			? notification.timestamp.getHours() === now.getHours() && notification.timestamp.getMinutes() === now.getMinutes()
				? this.NOTIFICATION_TIME_TYPE_NOW
				: this.NOTIFICATION_TIME_TYPE_TODAY
			: this.NOTIFICATION_TIME_TYPE_OLDER;
	}

	private getCountOfUnread(): Observable<GetUnreadNotificationCountInterface> {
		return this.http.get<GetUnreadNotificationCountInterface>(getApiUrl.apiUrl + '/notification/countOfUnread', {
			withCredentials: true,
		});
	}

	private fetchNotifications(
		filter: NotificationFilterInterface,
	): Observable<NotificationInterface[] | ResponseInterface> {
		const params: { isRead?: string; from?: string; to?: string } = {};
		if (filter.to !== undefined) params.to = filter.to.toString();
		if (filter.from !== undefined) params.from = filter.from.toString();
		if (filter.isRead === true) params.isRead = '1';
		else if (filter.isRead === false) params.isRead = '0';

		return this.http.get<NotificationInterface[]>(getApiUrl.apiUrl + '/notification/all', {
			withCredentials: true,
			params,
		});
	}

	fetchCountOfUnread() {
		return new Promise<void>((resolve) => {
			this.getCountOfUnread().subscribe((result) => {
				this.unreadNotificationCount = result.success ? result.count : 0;
				resolve();
			});
		});
	}

	updateNotifications(isRead?: boolean, from?: number, to?: number) {
		return new Promise<void>((resolve) => {
			this.fetchNotifications({ isRead, from, to }).subscribe((result) => {
				this.notifications = ('success' in result && !result?.success ? [] : result) as NotificationInterface[];
				for (const i in this.notifications) this.notifications[i].timestamp = new Date(this.notifications[i].timestamp);
				resolve();
			});
		});
	}
}
