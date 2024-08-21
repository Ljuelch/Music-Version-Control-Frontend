import { StemDownload as StemDownloadInterface } from './stemDownload.interface';

export interface StemsDownloadEvent extends StemDownloadInterface {
	alloverProgress: number;
	fileCount: number;
	doneCount: number;
}
