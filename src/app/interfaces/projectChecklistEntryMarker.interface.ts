import { Marker as MarkerInterface } from './marker.interface';
import { User as UserInterface } from './user.interface';

export interface ProjectChecklistEntryMarker extends MarkerInterface {
	user: UserInterface;
}
