import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getApiUrl } from '../../config';

@Injectable({
	providedIn: 'root',
})
export class FileUploadService {
	constructor(private readonly http: HttpClient) {}

	private getMimeType(filename: string): string | undefined {
		if (filename.endsWith('.wav')) return 'audio/wav';
		if (filename.endsWith('.aiff')) return 'audio/aiff';
		if (filename.endsWith('.mp3')) return 'audio/mp3';
		return undefined;
	}

	selectFile(options?: { multiple?: boolean; accept?: string }) {
		return new Observable<FileList | null>((observer) => {
			const input = document.createElement('input');
			input.type = 'file';
			input.hidden = true;
			input.multiple = !!options?.multiple;
			if (options?.accept) input.accept = options.accept;

			input.id = 'FileUploadService-fileSelect-' + Date.now();
			input.addEventListener('change', () => {
				observer.next(input.files || null);
				document.body.removeChild(input);
				observer.complete();
			});
			input.addEventListener('cancel', () => {
				observer.next(null);
				document.body.removeChild(input);
				observer.complete();
			});

			document.body.appendChild(input);
			input.click();
		});
	}

	uploadFile(url: string, file: File): Observable<HttpEvent<NonNullable<unknown>>> {
		const formData = new FormData();
		formData.append('file', file);

		return this.http.request(
			new HttpRequest('POST', url, formData, {
				reportProgress: true,
				withCredentials: true,
			}),
		);
	}

	uploadFileGCS(url: string, file: File): Observable<HttpEvent<NonNullable<unknown>>> {
		const mimetype = this.getMimeType(file.name);
		return this.http.request(
			new HttpRequest('PUT', url, file, {
				reportProgress: true,
				headers: new HttpHeaders({
					...(mimetype ? { 'Content-Type': mimetype } : {}),
				}),
			}),
		);
	}

	uploadAudioFile(projectId: number, versionNumber: number, file: File): Observable<HttpEvent<NonNullable<unknown>>> {
		return this.uploadFile(getApiUrl.apiUrl + `/project/version/file/audio/upload/${projectId}/${versionNumber}`, file);
	}
}
