import { ActionClick as ActionClickInterface } from '../abstract/actionClick.interface';
import { ProjectChecklistComponentEntry as ProjectChecklistComponentEntryInterface } from '../projectChecklistComponentEntry.interface';
import { ProjectChecklistEntryAction as ProjectChecklistEntryActionInterface } from '../projectChecklistEntryAction.interface';

export interface ProjectChecklistEntryActionClick extends ActionClickInterface {
	event: Event;
	action: ProjectChecklistEntryActionInterface;
	entry: ProjectChecklistComponentEntryInterface;
}
