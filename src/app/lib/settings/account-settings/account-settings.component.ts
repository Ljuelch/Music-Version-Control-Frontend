import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GetUserInfo as GetUserInfoInterface } from '../../../interfaces/api/getUserInfo.interface';
import { UserInfoService } from '../../../services/user-info.service';

@Component({
	selector: 'app-account-settings',
	templateUrl: './account-settings.component.html',
	styleUrls: ['./account-settings.component.scss'],
})
export class AccountSettingsComponent implements OnInit {
	protected readonly PLACEHOLDER = '...';

	form!: FormGroup;
	userInfo?: GetUserInfoInterface;
	userId?: number;

	constructor(
		private readonly fb: FormBuilder,
		private readonly userInfoService: UserInfoService,
		private readonly toastr: ToastrService,
	) {}

	ngOnInit() {
		this.form = this.fb.group({
			username: '',
			firstname: '',
			lastname: '',
			email: '',
			avatar: '',
			description: '',
			spotify: '',
			instagram: '',
			soundcloud: '',
			beatstars: '',
		});
		this.fetchUserInfo();
	}

	shouldDisableButton(): boolean {
		return (
			this.form.get('username')?.value === '' &&
			this.form.get('firstname')?.value === '' &&
			this.form.get('lastname')?.value === '' &&
			this.form.get('email')?.value === '' &&
			this.form.get('spotify')?.value === '' &&
			this.form.get('instagram')?.value === '' &&
			this.form.get('soundcloud')?.value === '' &&
			this.form.get('beatstars')?.value === '' &&
			this.form.get('description')?.value === ''
		);
	}

	submit() {
		if (this.form && this.form.valid) {
			const emailControl = this.form.get('email');
			if (emailControl) {
				const emailValue = emailControl.value;
				if (emailValue !== '') {
					this.toastr.info('Check your mail inbox, then you can change to another email', 'Email change detected');
				}
			}

			if (this.form) {
				this.userInfoService.updateUserInformation(this.form.value).subscribe(
					() => {
						this.fetchUserInfo();
						this.toastr.success('Updated successfully');
						this.form.patchValue({
							username: '',
							firstname: '',
							lastname: '',
							email: '',
							spotify: '',
							instagram: '',
							soundcloud: '',
							beatstars: '',
							description: '',
						});
					},
					(error) => {
						console.error('Error updating user information:', error);
						this.toastr.error('Updated failed');
					},
				);
			}
		} else {
			console.log('Form is invalid or null.');
		}
	}

	fetchUserInfo() {
		this.userInfoService.getUserInfo(this.userId).subscribe(
			(data: GetUserInfoInterface) => {
				this.userInfo = data;
			},
			(error) => {
				console.error('Error fetching user info:', error);
			},
		);
	}

	get formValues() {
		return this.form.value;
	}
}
