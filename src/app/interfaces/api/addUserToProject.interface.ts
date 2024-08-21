import { Response as ResponseInterface } from '../abstract/response.interface';

export interface AddUserToProject extends ResponseInterface {
	reason?: 'INVALID_ROLE' | 'UNKNONWN';
	action?: 'ADDED' | 'UPDAED';
}
