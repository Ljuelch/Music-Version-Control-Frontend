import { Response as ResponseInterface } from '../abstract/response.interface';

export interface AddProjectChecklistEntry extends ResponseInterface {
	reason: 'INVALID_PROJECT_OR_VERSION' | 'UNKNOWN';
	id?: number;
}
