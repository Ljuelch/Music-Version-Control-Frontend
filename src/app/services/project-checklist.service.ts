import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getApiUrl } from '../../config';
import { NewProjectChecklistEntry as NewProjectChecklistEntryInterface } from '../interfaces/action/newProjectChecklistEntry.interface';
import { AddProjectChecklistEntry as AddProjectChecklistEntryInterface } from '../interfaces/api/addProjectChecklistEntry.interface';
import { AddProjectChecklistEntryMarker as AddProjectChecklistEntryMarkerInterface } from '../interfaces/api/addProjectChecklistEntryMarker.interface';
import { CheckProjectChecklistEntry as CheckProjectChecklistEntryInterface } from '../interfaces/api/checkProjectChecklistEntry.interface';
import { DeleteProjectChecklistEntry as DeleteProjectChecklistEntryInterface } from '../interfaces/api/deleteProjectChecklistEntry.interface';
import { DeleteProjectChecklistEntryMarker as DeleteProjectChecklistEntryMarkerInterface } from '../interfaces/api/deleteProjectChecklistEntryMarker.interface';
import { GetProjectChecklistEntries as GetProjectChecklistEntriesInterface } from '../interfaces/api/getProjectChecklistEntries.interface';
import { RenameProjectChecklistEntry as RenameProjectChecklistEntryInterface } from '../interfaces/api/renameProjectChecklistEntry.interface';
import { SetProjectChecklistEntryMarkerColor as SetProjectChecklistEntryMarkerColorInterface } from '../interfaces/api/setProjectChecklistEntryMarkerColor.interface';
import { UncheckProjectChecklistEntry as UncheckProjectChecklistEntryInterface } from '../interfaces/api/uncheckProjectChecklistEntry.interface';
import { MarkerListMarker as MarkerListMarkerInterface } from '../interfaces/markerListMarker.interface';

@Injectable({
	providedIn: 'root',
})
export class ProjectChecklistService {
	constructor(private readonly http: HttpClient) {}

	getProjectChecklistEntries(
		project_id: number,
		versionNumber: number,
		checked: boolean | undefined = undefined,
		includeOlder: boolean = false,
	): Observable<GetProjectChecklistEntriesInterface> {
		return this.http.get<GetProjectChecklistEntriesInterface>(getApiUrl.apiUrl + '/project/checklist/entries', {
			params: {
				projectId: project_id,
				versionNumber,
				includeOlder: includeOlder ? '1' : '0',
				...(checked === undefined ? {} : { checked: checked ? '1' : '0' }),
			},
			withCredentials: true,
		});
	}

	addProjectChecklistEntry(project_id: number, versionNumber: number, entry: NewProjectChecklistEntryInterface) {
		return this.http.post<AddProjectChecklistEntryInterface>(
			getApiUrl.apiUrl + '/project/checklist/entry/add',
			{
				projectId: project_id,
				versionNumber,
				text: entry.text,
				marker: entry.marker,
			},
			{ withCredentials: true },
		);
	}

	renameProjectChecklistEntry(entryId: number, text: string) {
		return this.http.patch<RenameProjectChecklistEntryInterface>(
			getApiUrl.apiUrl + '/project/checklist/entry/rename',
			{ entryId, text },
			{ withCredentials: true },
		);
	}

	deleteProjectChecklistEntry(entryId: number) {
		return this.http.post<DeleteProjectChecklistEntryInterface>(
			getApiUrl.apiUrl + '/project/checklist/entry/delete',
			{ entryId },
			{ withCredentials: true },
		);
	}

	checkProjectChecklistEntry(entryId: number, rejected: boolean = false) {
		return this.http.patch<CheckProjectChecklistEntryInterface>(
			getApiUrl.apiUrl + '/project/checklist/entry/check',
			{ entryId, rejected },
			{ withCredentials: true },
		);
	}

	uncheckProjectChecklistEntry(entryId: number) {
		return this.http.patch<UncheckProjectChecklistEntryInterface>(
			getApiUrl.apiUrl + '/project/checklist/entry/uncheck',
			{ entryId },
			{ withCredentials: true },
		);
	}

	addProjectChecklistEntryMarker(entryId: number, color: string, start: number, end?: number) {
		if (start !== undefined && start.toString().split('.')[1]?.length > 1)
			throw new Error("'start' has more then 1 decimal places: " + start);
		if (end !== undefined && end.toString().split('.')[1]?.length > 1)
			throw new Error("'end' has more then 1 decimal places: " + end);

		return this.http.post<AddProjectChecklistEntryMarkerInterface>(
			getApiUrl.apiUrl + '/project/checklist/entry/marker',
			{ entryId, color, start, end },
			{ withCredentials: true },
		);
	}

	setProjectChecklistEntryMarkerColor(marker: MarkerListMarkerInterface, color?: string) {
		return this.http.patch<SetProjectChecklistEntryMarkerColorInterface>(
			getApiUrl.apiUrl + '/project/checklist/entry/marker/color',
			{
				markerId: marker.id,
				color: color || marker.color,
			},
			{ withCredentials: true },
		);
	}

	deleteProjectChecklistEntryMarker(marker: MarkerListMarkerInterface[]) {
		return this.http.post<DeleteProjectChecklistEntryMarkerInterface>(
			getApiUrl.apiUrl + '/project/checklist/entry/marker/delete',
			{ markerIds: marker.map((_marker) => _marker.id) },
			{ withCredentials: true },
		);
	}
}
