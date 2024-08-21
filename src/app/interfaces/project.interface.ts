import { ProjectVersion as ProjectVersionInterface } from './projectVersion.interface';
import { ProjectUserRole } from './types/projectUserRole.type';

export interface Project {
	id: number;
	name: string;
	role?: ProjectUserRole;
	lastVersion: ProjectVersionInterface;
	versions: ProjectVersionInterface[];
}
