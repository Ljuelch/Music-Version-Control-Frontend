import { ProjectVersion as ProjectVersionInterface } from './projectVersion.interface';

export interface ProjectInfo {
	versions: ProjectVersionInterface[];
	lastVersion?: ProjectVersionInterface;
}
