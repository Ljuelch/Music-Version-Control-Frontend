import { ProjectProjectChecklistEntryAction as ProjectProjectChecklistEntryActionInterface } from '../projectProjectChecklistEntryAction.interface';
import { ProjectChecklistEntryActionClick as ProjectChecklistEntryActionClickInterface } from './projectChecklistEntryActionClick.interface';

export interface ProjectProjectChecklistEntryActionClick extends ProjectChecklistEntryActionClickInterface {
	action: ProjectProjectChecklistEntryActionInterface;
}
