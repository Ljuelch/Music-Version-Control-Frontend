import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserSearchModal as UserSearchModalInterface } from '../../interfaces/action/modal/userSearchModal.interface';
import { AuthService } from '../../services/auth.service';
import { LoginStateService } from '../../services/login-state.service';
import { UserInfoService } from '../../services/user-info.service';
import { UserSearchModalComponent } from '../user-search-modal/user-search-modal.component';

@Component({
	selector: 'app-nav-bar',
	templateUrl: './nav-bar.component.html',
	styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
	@Input() sticky: boolean = false;

	@Input() userHome: boolean = false;
	@Input() userSearch: boolean = false;

	constructor(
		private readonly dialog: MatDialog,
		private readonly userInfoService: UserInfoService,
		protected readonly loginStateService: LoginStateService,
		protected readonly authService: AuthService,
	) {}

	protected openUserSearch() {
		this.dialog.open(UserSearchModalComponent, {
			width: '100%',
			height: '90%',
			data: { gotoUser: true } as UserSearchModalInterface,
		});
	}

	protected gotoHome() {
		this.userInfoService.gotoDashboard().then();
	}
}
