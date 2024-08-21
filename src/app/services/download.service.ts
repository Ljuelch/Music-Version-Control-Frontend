import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class DownloadService {
	constructor(private readonly http: HttpClient) {}

	getAsArrayBuffer(url: string): Observable<{ url: string; event: HttpEvent<NonNullable<unknown>> }> {
		return new Observable<{ url: string; event: HttpEvent<NonNullable<unknown>> }>((observer) => {
			this.http
				.request(
					new HttpRequest('GET', url, {
						reportProgress: true,
						responseType: 'arraybuffer',
					}),
				)
				.subscribe(
					(event) => {
						observer.next({ url, event: event as HttpEvent<NonNullable<unknown>> });
					},
					(error) => {
						observer.error(error);
					},
					() => {
						observer.complete();
					},
				);
		});
	}

	download(url: string, name: string): Observable<{ url: string; event: HttpEvent<NonNullable<unknown>> }> {
		const request = this.getAsArrayBuffer(url);
		request.subscribe(({ event }) => {
			if (event.type === HttpEventType.Response)
				this.downloadBlob(new Blob([event.body as ArrayBuffer], { type: 'application/octet-stream' }), name);
		});
		return request;
	}

	downloadBlob(blob: Blob, name: string) {
		const anchor = document.createElement('a');
		anchor.href = window.URL.createObjectURL(blob);
		anchor.download = name;

		document.body.appendChild(anchor);
		anchor.click();
		document.body.removeChild(anchor);
	}
}
