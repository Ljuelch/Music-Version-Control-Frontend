import { Response as ResponseInterface } from '../abstract/response.interface';
import { ProjectChecklistEntry as ProjectChecklistEntryInterface } from '../projectChecklistEntry.interface';

export interface GetProjectChecklistEntries extends ResponseInterface {
	entries: ProjectChecklistEntryInterface[];
}
