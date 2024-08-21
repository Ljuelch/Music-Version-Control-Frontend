import { Response as ResponseInterface } from '../abstract/response.interface';

export interface SetProjectChecklistEntryMarkerColor extends ResponseInterface {
	reason?: 'INVALID_MARKER_ID' | 'INVALID_COLOR_VALUE' | 'UNKNOWN';
}
