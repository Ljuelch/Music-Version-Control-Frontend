import { Response as ResponseInterface } from '../abstract/response.interface';

export interface CreateProjectVersion extends ResponseInterface {
	reason?: 'UNKNOWN';
	version?: number;
}
