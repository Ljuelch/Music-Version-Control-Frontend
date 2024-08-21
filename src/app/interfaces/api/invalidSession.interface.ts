import { Response as ResponseInterface } from '../abstract/response.interface';

export interface InvalidSession extends ResponseInterface {
	reason: 'INVALID_SESSION';
}
