import { StemUpload as StemUploadInterface } from './stemUpload.interface';

export interface StemsUploadEvent extends StemUploadInterface {
	alloverProgress: number;
	fileCount: number;
	doneCount: number;
}
