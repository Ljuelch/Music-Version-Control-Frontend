import { Response as ResponseInterface } from '../abstract/response.interface';

export interface DeleteProjectChecklistEntry extends ResponseInterface {
	reason: 'OLD_PROJECT_VERSION' | 'INVALID_PROJECT_OR_VERSION' | 'UNKNOWN';
}
