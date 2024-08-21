import { ProjectChecklistEntry as ProjectChecklistEntryInterface } from './projectChecklistEntry.interface';
import { ProjectChecklistEntryMarker as ProjectChecklistEntryMarkerInterface } from './projectChecklistEntryMarker.interface';

export interface ProjectChecklistComponentEntry {
	new: boolean;
	editing: string | false;
	startNewEditingAfter: boolean;
	entry: ProjectChecklistEntryInterface | null;
	marker?: ProjectChecklistEntryMarkerInterface[];
}
