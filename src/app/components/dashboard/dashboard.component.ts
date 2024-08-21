import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GetUserInfo as GetUserInfoInterface } from '../../interfaces/api/getUserInfo.interface';
import { Project as ProjectInterface } from '../../interfaces/project.interface';
import { NewProjectModalComponent } from '../../lib/new-project-modal/new-project-modal.component';
import { ProjectService } from '../../services/project.service';
import { UserInfoService } from '../../services/user-info.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnChanges {
	@Input() fetchOnInit: boolean = true;
	@Input() userId?: number;

	userInfo?: GetUserInfoInterface;
	projects: ProjectInterface[] = [];

	loading: boolean = false;

	constructor(
		public readonly dialog: MatDialog,
		private readonly userInfoService: UserInfoService,
		private readonly projectService: ProjectService,
	) {}

	ngOnInit() {
		if (this.fetchOnInit) {
			this.loading = true;
			this.fetchUserInfo().then(() => {
				this.fetchProjects().then(() => {
					this.loading = false;
				});
			});
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['userId']) {
			this.loading = true;
			// TODO: fetch other users projects
			this.projects = []; //this.fetchProjects();
			this.fetchUserInfo().then(() => {
				this.loading = false;
			});
		}
	}

	fetchUserInfo() {
		return new Promise<void>((resolve) => {
			this.userInfoService.getUserInfo(this.userId).subscribe(
				(data) => {
					// TODO: handle error responses
					this.userInfo = data;
					resolve();
				},
				(error) => {
					console.error('Error fetching user info:', error);
					resolve();
				},
			);
		});
	}

	async fetchProjects() {
		this.projects = await this.projectService.getProjectsAndPrepare();
	}

	openDialog() {
		this.dialog.open(NewProjectModalComponent, {
			minWidth: '320px',
			maxWidth: '540px',
		});
	}

	followUser(user_id: number) {
		this.loading = true;
		this.userInfoService.followUser(user_id).subscribe(() => {
			this.fetchUserInfo().then(() => {
				this.loading = false;
			});
		});
	}

	unfollowUser(user_id: number) {
		this.loading = true;
		this.userInfoService.unfollowUser(user_id).subscribe(() => {
			this.fetchUserInfo().then(() => {
				this.loading = false;
			});
		});
	}
}
