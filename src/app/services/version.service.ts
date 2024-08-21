import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getApiUrl } from '../../config';
import { VersionFile as VersionFileInterface } from '../interfaces/versionFile.interface';

@Injectable({
	providedIn: 'root',
})
export class VersionService {
	constructor(private readonly http: HttpClient) {}

	getVersionFiles(projectId: number, versionNumber: number): Observable<VersionFileInterface[]> {
		return this.http.get<VersionFileInterface[]>(getApiUrl.apiUrl + '/project/version/files', {
			params: {
				id: projectId,
				version: versionNumber,
			},
			withCredentials: true,
		});
	}
}
