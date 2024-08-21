import { Project as ProjectInterface } from '../../project.interface';

export interface NewProjectVersionModal {
	projectInfo: ProjectInterface;
	versionNumber?: number;
	songBPM?: number;
	songKey?: string;
}
