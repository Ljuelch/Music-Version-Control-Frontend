import { Action as ActionInterface } from './abstract/action.interface';
import { MarkerListActionName } from './types/markerListActionName.type';
import { MarkerListActionType } from './types/markerListActionType.type';

export interface MarkerListAction extends ActionInterface {
	name: MarkerListActionName;
	type?: MarkerListActionType;
	global?: boolean;
}
