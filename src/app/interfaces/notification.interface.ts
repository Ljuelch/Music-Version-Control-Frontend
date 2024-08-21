import { NotificationParam as NotificationParamInterface } from './notificationParam.interface';

export interface Notification {
	id: number;
	user_id: number;
	notificationTemplateId: number;
	timestamp: Date;
	isRead: boolean;
	params: NotificationParamInterface[];
}
