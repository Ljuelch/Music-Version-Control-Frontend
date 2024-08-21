import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ResetPasswordService } from '../../../services/reset-password.service';

@Component({
	selector: 'app-security-settings',
	templateUrl: './security-settings.component.html',
	styleUrls: ['./security-settings.component.scss'],
})
export class SecuritySettingsComponent {
	constructor(
		private readonly resetPassword: ResetPasswordService,
		private readonly toastr: ToastrService,
	) {}

	requestPasswordReset() {
		this.resetPassword.requestPasswordReset().subscribe((response) => {
			console.log(response);
			this.toastr.info('Check your mail inbox, then you can change your password', 'Password change detected');
		});
	}
}
