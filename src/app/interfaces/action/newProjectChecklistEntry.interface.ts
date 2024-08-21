import { ProjectChecklistEntryMarker as ProjectChecklistEntryMarkerInterface } from '../projectChecklistEntryMarker.interface';

export interface NewProjectChecklistEntry {
	text: string;
	marker: ProjectChecklistEntryMarkerInterface[];
}
