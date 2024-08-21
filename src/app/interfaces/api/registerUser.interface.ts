import { Response as ResponseInterface } from '../abstract/response.interface';

export interface RegisterUser extends ResponseInterface {
	reason?: 'USERNAME_ALREADY_TAKEN' | 'EMAIL_ALREADY_TAKEN' | 'UNKNOWN';
}
