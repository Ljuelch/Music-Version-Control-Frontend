import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { getApiUrl } from '../../config';
import { NewProject as NewProjectInterface } from '../interfaces/action/newProject.interface';
import { AddUserToProject as AddUserToProjectInterface } from '../interfaces/api/addUserToProject.interface';
import { CreateProject as CreateProjectInterface } from '../interfaces/api/createProject.interface';
import { CreateProjectVersion as CreateProjectVersionInterface } from '../interfaces/api/createProjectVersion.interface';
import { GetProjectInfo as GetProjectInfoInterface } from '../interfaces/api/getProjectInfo.interface';
import { ProjectUsersResponse as ProjectUsersResponseInterface } from '../interfaces/api/projectUsersResponse.interface';
import { RemoveUserFromProject as RemoveUserFromProjectInterface } from '../interfaces/api/removeUserFromProject.interface';
import { Project as ProjectInterface } from '../interfaces/project.interface';
import { ProjectUser as ProjectUserInterface } from '../interfaces/projectUser.interface';
import { ProjectVersion as ProjectVersionInterface } from '../interfaces/projectVersion.interface';
import { ProjectUserRole } from '../interfaces/types/projectUserRole.type';
import { VersionService } from './version.service';
import { WaveformPlayerService } from './waveform-player.service';

@Injectable({
	providedIn: 'root',
})
export class ProjectService {
	constructor(
		private readonly http: HttpClient,
		private readonly router: Router,
		private readonly versionService: VersionService,
		private readonly waveformPlayerService: WaveformPlayerService,
	) {}

	sortProjectUsers(users: ProjectUserInterface[]): ProjectUserInterface[] {
		const arrO = [],
			arrA = [],
			arrS = [];
		for (const user of users) {
			switch (user.role) {
				case 'O':
					arrO.push(user);
					break;
				case 'A':
					arrA.push(user);
					break;
				case 'S':
					arrS.push(user);
					break;
			}
		}
		return [
			...arrO.sort((userA, userB) => userA.user.username.localeCompare(userB.user.username)),
			...arrA.sort((userA, userB) => userA.user.username.localeCompare(userB.user.username)),
			...arrS.sort((userA, userB) => userA.user.username.localeCompare(userB.user.username)),
		];
	}

	async gotoProject(project_id: number, versionNumber?: number) {
		await this.router.navigate(versionNumber ? ['/project', project_id, 'v', versionNumber] : ['/project', project_id]);
	}

	getProjects(): Observable<ProjectInterface[]> {
		return this.http.get<ProjectInterface[]>(getApiUrl.apiUrl + '/project/all', { withCredentials: true });
	}

	getProjectsAndPrepare(): Promise<ProjectInterface[]> {
		return new Promise<ProjectInterface[]>((resolve) => {
			this.getProjects().subscribe(async (projects) => {
				for (const i in projects) {
					const result = await this.fetchProjectInfo(projects[i].id, projects[i].lastVersion.versionNumber);
					if (result) {
						projects[i].versions = result.projectInfo.versions;
						projects[i].lastVersion = result.projectInfo.lastVersion;
					}
				}
				resolve(projects);
			});
		});
	}

	createProject(project: NewProjectInterface): Observable<CreateProjectInterface> {
		return this.http.post<CreateProjectInterface>(getApiUrl.apiUrl + '/project/create', project, {
			withCredentials: true,
		});
	}

	getProjectInfo(project_id: number): Observable<GetProjectInfoInterface> {
		return this.http.get<GetProjectInfoInterface>(getApiUrl.apiUrl + '/project/info', {
			params: { id: project_id },
			withCredentials: true,
		});
	}

	getProjectInfoByVersionId(version_id: number): Observable<ProjectInterface> {
		return this.http.get<ProjectInterface>(getApiUrl.apiUrl + '/project/info', {
			params: { versionId: version_id },
			withCredentials: true,
		});
	}

	fetchProjectInfo(
		project_id: number,
		versionNumber?: number,
	): Promise<{
		currentVersion?: ProjectVersionInterface;
		lastVersion?: ProjectVersionInterface;
		projectInfo: ProjectInterface;
	} | void> {
		return new Promise<{
			currentVersion?: ProjectVersionInterface;
			lastVersion?: ProjectVersionInterface;
			projectInfo: ProjectInterface;
		} | void>((resolve) => {
			this.getProjectInfo(project_id).subscribe(
				async (info: GetProjectInfoInterface) => {
					for (const i in info.versions) info.versions[i].date = new Date(info.versions[i].timestamp);

					let lastVersion: ProjectVersionInterface = info.versions[0];
					for (const version of info.versions)
						if (version.versionNumber > lastVersion.versionNumber) lastVersion = version;

					info.lastVersion = lastVersion;
					if (project_id && versionNumber) {
						const versionIndex = info.versions.findIndex((version) => version.versionNumber === versionNumber);
						this.versionService
							.getVersionFiles(project_id, info.versions[versionIndex].versionNumber)
							.subscribe((files) => {
								info.versions[versionIndex].files = files;
								const hash = info.versions[versionIndex].files.find(({ type }) => type === 'wav')?.hash || '';
								if (hash) {
									info.versions[versionIndex].waveformURL = null;
									this.waveformPlayerService.getWaveformURL(hash).then((url) => {
										info.versions[versionIndex].waveformURL = url;
									});
								}
								resolve({ currentVersion: info.versions[versionIndex], projectInfo: info });
							});
					} else resolve({ lastVersion, projectInfo: info });
				},
				(error) => {
					console.error('Error fetching project info:', error);
					resolve();
				},
			);
		});
	}

	getProjectUsers(project_id: number): Observable<ProjectUsersResponseInterface> {
		return this.http.get<ProjectUsersResponseInterface>(getApiUrl.apiUrl + '/project/users', {
			params: { id: project_id },
			withCredentials: true,
		});
	}

	addUserToProject(project_id: number, user_id: number, role: ProjectUserRole): Observable<AddUserToProjectInterface> {
		return this.http.post<AddUserToProjectInterface>(
			getApiUrl.apiUrl + '/project/user/add',
			{
				id: project_id,
				user_id,
				role,
			},
			{ withCredentials: true },
		);
	}

	removeUserFromProject(project_id: number, user_id: number): Observable<RemoveUserFromProjectInterface> {
		return this.http.post<RemoveUserFromProjectInterface>(
			getApiUrl.apiUrl + '/project/user/remove',
			{
				id: project_id,
				user_id,
			},
			{ withCredentials: true },
		);
	}

	createProjectVersion(
		project_id: number,
		songBPM?: number,
		songKey?: string,
	): Observable<CreateProjectVersionInterface> {
		return this.http.post<CreateProjectVersionInterface>(
			getApiUrl.apiUrl + '/project/version/create',
			{
				projectId: project_id,
				...(songBPM !== undefined ? { songBPM } : {}),
				...(songKey !== undefined ? { songKey } : {}),
			},
			{ withCredentials: true },
		);
	}
}
