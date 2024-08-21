import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GetUserInfo as GetUserInfoInterface } from '../../../interfaces/api/getUserInfo.interface';

@Component({
	selector: 'app-dashboard-header-self',
	templateUrl: './dashboard-header-self.component.html',
	styleUrls: ['./dashboard-header-self.component.scss'],
})
export class DashboardHeaderSelfComponent {
	@Input('userInfo') userInfo?: GetUserInfoInterface;
	@Input('loading') loading: boolean = false;
	@Output() plusClick = new EventEmitter<void>();
}
