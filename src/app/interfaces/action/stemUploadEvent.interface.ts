import { HttpEventType } from '@angular/common/http';

export interface StemUploadEvent {
	file: File;
	type: HttpEventType;
	loaded?: number;
	total?: number;
}
