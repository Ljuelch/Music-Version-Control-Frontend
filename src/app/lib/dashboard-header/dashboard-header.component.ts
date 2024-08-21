import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GetUserInfo as GetUserInfoInterface } from '../../interfaces/api/getUserInfo.interface';

@Component({
	selector: 'app-dashboard-header',
	templateUrl: './dashboard-header.component.html',
})
export class DashboardHeaderComponent {
	@Input() userInfo?: GetUserInfoInterface;
	@Input() loading: boolean = false;

	@Output() readonly plusClick = new EventEmitter<void>();
	@Output() readonly followClick = new EventEmitter<number>();
	@Output() readonly unfollowClick = new EventEmitter<number>();

	protected get userExists(): boolean {
		return !this.userInfo || this.userInfo.success;
	}
}
