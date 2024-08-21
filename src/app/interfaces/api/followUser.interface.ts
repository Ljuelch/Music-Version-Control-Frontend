import { Response as ResponseInterface } from '../abstract/response.interface';

export interface FollowUser extends ResponseInterface {
	reason?: 'USER_NOT_PUBLIC' | 'ALREADY_FOLLOWING';
}
