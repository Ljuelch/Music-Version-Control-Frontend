import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProjectUser as ProjectUserInterface } from '../../interfaces/projectUser.interface';
import { ProjectUserRole } from '../../interfaces/types/projectUserRole.type';
import { ProjectService } from '../../services/project.service';
import { UserInfoService } from '../../services/user-info.service';
import { ROLE_ICON } from '../../shared/roleIcon';

@Component({
	selector: 'app-project-contributors-table',
	templateUrl: './project-contributors-table.component.html',
	styleUrls: ['./project-contributors-table.component.scss'],
})
export class ProjectContributorsTableComponent implements OnChanges {
	protected readonly ROLE_ICON = ROLE_ICON;

	@Input() project_id!: number;

	projectUsers: ProjectUserInterface[] = [];

	get selfProjectUser(): ProjectUserInterface | undefined {
		return this.projectUsers.find(({ user }) => user.isSelf);
	}

	isSelfRole(role: ProjectUserRole | ProjectUserRole[]): boolean {
		return !!(typeof role === 'string'
			? this.selfProjectUser?.role === role
			: this.selfProjectUser?.role && role.includes(this.selfProjectUser?.role));
	}

	constructor(
		private readonly projectService: ProjectService,
		protected readonly userInfoService: UserInfoService,
	) {}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['project_id']) this.fetchProjectUsers();
	}

	fetchProjectUsers() {
		this.projectService.getProjectUsers(this.project_id).subscribe((result) => {
			if (result.success) this.projectUsers = this.projectService.sortProjectUsers(result.users);
			else console.error('could not load project users:', result.reason);
		});
	}

	updateUserRole(user_id: number, role: ProjectUserRole) {
		this.projectService.addUserToProject(this.project_id, user_id, role).subscribe(() => {
			this.fetchProjectUsers();
		});
	}

	removeUserFromProject(user_id: number) {
		this.projectService.removeUserFromProject(this.project_id, user_id).subscribe(() => {
			this.fetchProjectUsers();
		});
	}
}
