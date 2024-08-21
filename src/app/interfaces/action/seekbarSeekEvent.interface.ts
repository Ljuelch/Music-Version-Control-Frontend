import { SeekbarSeekEventType } from '../types/seekbarSeekEventType.type';

export interface SeekbarSeekEvent {
	time: number;
	type: SeekbarSeekEventType;
}
