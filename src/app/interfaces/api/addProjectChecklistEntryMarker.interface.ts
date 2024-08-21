import { Response as ResponseInterface } from '../abstract/response.interface';

export interface AddProjectChecklistEntryMarker extends ResponseInterface {
	reason?: 'INVALID_ENTRY_ID' | 'UNKNOWN';
}
