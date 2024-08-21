import { Response as ResponseInterface } from '../abstract/response.interface';
import { Project as ProjectInterface } from '../project.interface';

export interface GetProjectInfo extends ResponseInterface, ProjectInterface {}
