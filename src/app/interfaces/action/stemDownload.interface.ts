export interface StemDownload {
	stemId: number;
	url?: string;
	name?: string;
	blob?: Blob;
	progress: number;
	done: boolean;
}
