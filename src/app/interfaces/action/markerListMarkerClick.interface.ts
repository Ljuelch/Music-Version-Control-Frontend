import { ActionClick as ActionClickInterface } from '../abstract/actionClick.interface';
import { MarkerListAction as MarkerListActionInterface } from '../markerListAction.interface';
import { MarkerListMarker as MarkerListMarkerInterface } from '../markerListMarker.interface';

export interface MarkerListMarkerClick extends ActionClickInterface {
	action: MarkerListActionInterface;
	marker: MarkerListMarkerInterface[];
}
