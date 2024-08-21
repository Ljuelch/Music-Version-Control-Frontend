import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserInfoService } from '../../services/user-info.service';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
	selector: 'app-user-dashboard',
	templateUrl: './user-dashboard.component.html',
	styleUrls: ['./user-dashboard.component.scss'],
})
export class UserDashboardComponent implements OnInit {
	@ViewChild(DashboardComponent) dashboardComponent!: DashboardComponent;

	user_id?: number;

	constructor(
		private readonly route: ActivatedRoute,
		private readonly userInfoService: UserInfoService,
	) {}

	ngOnInit() {
		this.route.params.subscribe(async (params) => {
			this.user_id = +params['user_id'];
			await this.fetchUserInfo();
		});
	}

	fetchUserInfo() {
		return new Promise<void>((resolve) => {
			this.userInfoService.getUserInfo(this.user_id).subscribe(
				(data) => {
					// TODO: handle error responses
					if (data.isSelf) this.userInfoService.gotoDashboard().then();
					else this.dashboardComponent.userInfo = data;
					resolve();
				},
				(error) => {
					console.error('Error fetching user info:', error);
					resolve();
				},
			);
		});
	}
}
