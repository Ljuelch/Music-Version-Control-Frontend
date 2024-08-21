import { ActionName } from '../types/actionName.type';

export interface Action {
	name: ActionName;
	content: string;
	class?: string;
}
