import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GetUserInfo as GetUserInfoInterface } from '../../../interfaces/api/getUserInfo.interface';

@Component({
	selector: 'app-dashboard-header-user',
	templateUrl: './dashboard-header-user.component.html',
	styleUrls: ['./dashboard-header-user.component.scss'],
})
export class DashboardHeaderUserComponent {
	@Input('userInfo') userInfo?: GetUserInfoInterface;
	@Input('loading') loading: boolean = false;
	@Output() followClick = new EventEmitter<number>();
	@Output() unfollowClick = new EventEmitter<number>();
}
