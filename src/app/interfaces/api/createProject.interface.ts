import { Response as ResponseInterface } from '../abstract/response.interface';

export interface CreateProject extends ResponseInterface {
	project_id?: number;
	versionNumber?: number;
}
