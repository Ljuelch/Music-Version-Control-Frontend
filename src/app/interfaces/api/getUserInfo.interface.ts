import { Response as ResponseInterface } from '../abstract/response.interface';
import { User as UserInterface } from '../user.interface';

export interface GetUserInfo extends ResponseInterface, UserInterface {
	isSelf: boolean;
	blocked: boolean;
	public: boolean;
	isFollowing?: boolean;
}
