import { Response as ResponseInterface } from '../abstract/response.interface';

export interface GetStemUploadURL extends ResponseInterface {
	reason?: 'UNKNOWN' | 'INVALID_PROJECT_OR_VERSION';
	url?: string;
}
