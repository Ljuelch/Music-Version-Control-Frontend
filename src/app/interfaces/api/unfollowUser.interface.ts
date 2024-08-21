import { Response as ResponseInterface } from '../abstract/response.interface';

export interface UnfollowUser extends ResponseInterface {
	reason?: 'ALREADY_UNFOLLOWED';
}
