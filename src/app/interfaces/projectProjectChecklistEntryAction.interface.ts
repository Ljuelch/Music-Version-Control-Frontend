import { ProjectChecklistEntryAction as ProjectChecklistEntryActionInterface } from './projectChecklistEntryAction.interface';
import { ProjectProjectChecklistEntryActionName } from './types/projectProjectChecklistEntryActionName.type';

export interface ProjectProjectChecklistEntryAction extends ProjectChecklistEntryActionInterface {
	name: ProjectProjectChecklistEntryActionName;
}
