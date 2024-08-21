import { User as UserInterface } from './user.interface';

export interface Marker {
	user?: UserInterface;
	color: string;
	start: number;
	end?: number;
}
