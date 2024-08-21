import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as JSZip from 'jszip';
import { Observable } from 'rxjs';
import { getApiUrl } from '../../config';
import { StemDownload as StemDownloadInterface } from '../interfaces/action/stemDownload.interface';
import { StemUpload as StemUploadInterface } from '../interfaces/action/stemUpload.interface';
import { StemUploadEvent as StemUploadEventInterface } from '../interfaces/action/stemUploadEvent.interface';
import { StemsDownloadEvent as StemsDownloadEventInterface } from '../interfaces/action/stemsDownloadEvent.interface';
import { StemsUploadEvent as StemsUploadEventInterface } from '../interfaces/action/stemsUploadEvent.interface';
import { GetStemDownloadURL as GetStemDownloadURLInterface } from '../interfaces/api/getStemDownloadURL.interface';
import { GetStemUploadURL as GetStemUploadURLInterface } from '../interfaces/api/getStemUploadURL.interface';
import { ProjectStemsResponse as ProjectStemsResponseInterface } from '../interfaces/api/projectStemsResponse.interface';
import { DownloadService } from './download.service';
import { FileUploadService } from './file-upload.service';

@Injectable({
	providedIn: 'root',
})
export class StemsService {
	constructor(
		private readonly http: HttpClient,
		private readonly fileUploadService: FileUploadService,
		private readonly downloadService: DownloadService,
	) {}

	getStems(project_id: number, versionNumber: number): Observable<ProjectStemsResponseInterface> {
		return this.http.get<ProjectStemsResponseInterface>(getApiUrl.apiUrl + '/project/version/file/stems', {
			params: {
				projectId: project_id,
				versionNumber,
			},
			withCredentials: true,
		});
	}

	private getStemUploadURL(
		projectId: number,
		versionNumber: number,
		file: File,
	): Observable<GetStemUploadURLInterface> {
		return this.http.get<GetStemUploadURLInterface>(getApiUrl.apiUrl + '/project/version/file/stems/uploadURL', {
			params: {
				projectId,
				versionNumber,
				fileName: file.name,
			},
			withCredentials: true,
		});
	}

	private uploadStem(projectId: number, versionNumber: number, file: File): Observable<StemUploadEventInterface> {
		return new Observable<StemUploadEventInterface>((observer) => {
			this.getStemUploadURL(projectId, versionNumber, file).subscribe((result) => {
				if (result.success && result.url)
					this.fileUploadService.uploadFileGCS(result.url, file).subscribe(
						(event) => {
							observer.next({ ...event, file });
							if (event.type === HttpEventType.Response) observer.complete();
						},
						(error) => {
							observer.error(error);
							observer.complete();
						},
						() => observer.complete(),
					);
				else {
					observer.error(result.reason);
					observer.complete();
				}
			});
		});
	}

	private getStemDownloadURL(stemId: number): Promise<{ stemId: number; result: GetStemDownloadURLInterface }> {
		return new Promise<{ stemId: number; result: GetStemDownloadURLInterface }>((resolve) => {
			this.http
				.get<GetStemDownloadURLInterface>(getApiUrl.apiUrl + '/project/version/file/stems/downloadURL', {
					params: {
						id: stemId,
					},
					withCredentials: true,
				})
				.subscribe((result) => {
					resolve({ stemId, result });
				});
		});
	}

	uploadStems(project_id: number, versionNumber: number, files: FileList): Observable<StemsUploadEventInterface> {
		return new Observable<StemsUploadEventInterface>((observer) => {
			const uploads: StemUploadInterface[] = [];

			for (let i = 0; i < files.length; i++) {
				uploads.push({ file: files[i], progress: 0, done: false });

				this.uploadStem(project_id, versionNumber, files[i]).subscribe(
					(event) => {
						const upload = uploads.find(({ file }) => file === event.file) as StemUploadInterface;

						switch (event.type) {
							case HttpEventType.UploadProgress:
								upload.progress = event.loaded! / event.total!;
								break;

							case HttpEventType.Response:
								upload.progress = 1;
								upload.done = true;
								break;
						}

						let alloverProgress = 0;
						for (const upload of uploads) alloverProgress += upload.progress;
						alloverProgress = alloverProgress / uploads.length;

						const fileCount = uploads.length,
							doneCount = uploads.filter(({ done }) => done).length;

						observer.next({
							...upload,
							alloverProgress,
							fileCount,
							doneCount,
						});

						if (fileCount === doneCount) observer.complete();
					},
					(error) => {
						observer.error(error);
					},
				);
			}
		});
	}

	downloadStem(stemId: number) {
		return new Promise<{
			download: Observable<{ url: string; event: HttpEvent<NonNullable<unknown>> }>;
			name: string;
			stemId: number;
		} | void>(async (resolve) => {
			const { result } = await this.getStemDownloadURL(stemId);
			if (result.success && result.url && result.name)
				resolve({
					stemId,
					name: result.name,
					download: this.downloadService.download(result.url, result.name),
				});
			else resolve();
		});
	}

	downloadStems(stemIds: number[], zipFileName: string) {
		return new Observable<StemsDownloadEventInterface>((observer) => {
			const downloads: StemDownloadInterface[] = [];

			for (const stemId of stemIds) {
				downloads.push({ stemId, progress: 0, done: false });
				this.getStemDownloadURL(stemId).then(
					({ stemId, result }) => {
						if (result.success && result.url) {
							const download = downloads.find((thisResult) => thisResult.stemId === stemId) as StemDownloadInterface;
							download.name = result.name;
							download.url = result.url;
							this.downloadService.getAsArrayBuffer(result.url).subscribe(({ url, event }) => {
								const download = downloads.find((thisResult) => thisResult.url === url) as StemDownloadInterface;

								switch (event.type) {
									case HttpEventType.DownloadProgress:
										download.progress = event.loaded / event.total!;
										break;

									case HttpEventType.Response:
										download.blob = new Blob([event.body as ArrayBuffer], { type: 'application/octet-stream' });
										download.progress = 1;
										download.done = true;
										break;
								}

								let alloverProgress = 0;
								for (const upload of downloads) alloverProgress += upload.progress;
								alloverProgress = alloverProgress / downloads.length;

								const fileCount = downloads.length,
									doneCount = downloads.filter(({ done }) => done).length;

								observer.next({
									...download,
									alloverProgress,
									fileCount,
									doneCount,
								});

								if (fileCount === doneCount) {
									const zip = new JSZip();

									for (const download of downloads)
										if (download.name && download.blob) zip.file(download.name, download.blob);

									zip.generateAsync({ type: 'blob' }).then((blob) => {
										this.downloadService.downloadBlob(blob, zipFileName);
										observer.complete();
									});
								}
							});
						}
					},
					(error) => {
						observer.error(error);
					},
				);
			}
		});
	}
}
