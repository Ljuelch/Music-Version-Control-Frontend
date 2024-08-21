import { Response as ResponseInterface } from '../abstract/response.interface';

export interface GetStemDownloadURL extends ResponseInterface {
	reason?: 'INVALID_STEM_ID';
	url?: string;
	name?: string;
}
