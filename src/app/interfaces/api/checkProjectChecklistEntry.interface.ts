import { Response as ResponseInterface } from '../abstract/response.interface';

export interface CheckProjectChecklistEntry extends ResponseInterface {
	reason: 'INVALID_PROJECT_OR_VERSION' | 'UNKNOWN';
}
