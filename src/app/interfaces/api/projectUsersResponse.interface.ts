import { Response as ResponseInterface } from '../abstract/response.interface';
import { ProjectUser as ProjectUserInterface } from '../projectUser.interface';

export interface ProjectUsersResponse extends ResponseInterface {
	users: ProjectUserInterface[];
}
