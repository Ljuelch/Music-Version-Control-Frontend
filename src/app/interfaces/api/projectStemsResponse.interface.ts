import { Response as ResponseInterface } from '../abstract/response.interface';
import { ProjectStem as ProjectStemInterface } from '../projectStem.interface';

export interface ProjectStemsResponse extends ResponseInterface {
	stems: ProjectStemInterface[];
}
