import { Marker as MarkerInterface } from './marker.interface';

export interface MarkerListMarker extends MarkerInterface {
	id?: string;
	versionId?: number;
	text?: string;
}
