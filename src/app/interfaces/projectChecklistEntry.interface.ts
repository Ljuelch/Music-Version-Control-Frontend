import { ProjectChecklistEntryMarker as ProjectChecklistEntryMarkerInterface } from './projectChecklistEntryMarker.interface';
import { User as UserInterface } from './user.interface';

export interface ProjectChecklistEntry {
	id: number;
	user: UserInterface;
	timestamp: Date;
	text: string;
	checkedVersionNumber: number | null;
	rejected?: boolean;
	marker: ProjectChecklistEntryMarkerInterface[];
}
