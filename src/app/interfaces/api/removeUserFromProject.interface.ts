import { Response as ResponseInterface } from '../abstract/response.interface';

export interface RemoveUserFromProject extends ResponseInterface {
	reason: 'USER_DOES_NOT_EXIST';
}
