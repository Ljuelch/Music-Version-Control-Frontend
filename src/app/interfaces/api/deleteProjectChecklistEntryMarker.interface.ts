import { Response as ResponseInterface } from '../abstract/response.interface';

export interface DeleteProjectChecklistEntryMarker extends ResponseInterface {
	reason?: 'INVALID_MARKER_ID' | 'UNKNOWN';
}
