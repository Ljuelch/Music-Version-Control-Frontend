import { Response as ResponseInterface } from '../abstract/response.interface';

export interface GetUnreadNotificationCount extends ResponseInterface {
	count: number;
}
