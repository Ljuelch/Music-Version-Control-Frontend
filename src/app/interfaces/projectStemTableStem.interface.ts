import { ProjectStem as ProjectStemInterface } from './projectStem.interface';

export interface ProjectStemTableStem extends ProjectStemInterface {
	shortName: string;
	selected: boolean;
}
