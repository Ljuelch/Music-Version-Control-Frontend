import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GetUserInfo as GetUserInfoInterface } from '../../interfaces/api/getUserInfo.interface';
import { Project as ProjectInterface } from '../../interfaces/project.interface';

@Component({
	selector: 'app-dashboard-body',
	templateUrl: './dashboard-body.component.html',
})
export class DashboardBodyComponent {
	@Input() userInfo?: GetUserInfoInterface;
	@Input() projects!: ProjectInterface[];
	@Input() loading: boolean = false;

	@Input() songCardScrollAmount?: number;
	@Input() songCardShowEmpty?: boolean = true;
	@Output() readonly songCardEmptyClick = new EventEmitter<void>();

	protected get userExists(): boolean {
		return !this.userInfo || this.userInfo.success;
	}

	protected get _songCardShowEmpty(): boolean {
		return this.songCardShowEmpty === undefined ? this.userInfo?.isSelf !== false : this.songCardShowEmpty;
	}
}
