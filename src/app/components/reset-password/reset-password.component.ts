import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestPasswordReset as RequestPasswordResetInterface } from '../../interfaces/api/requestPasswordReset.interface';
import { ResetPassword as ResetPasswordInterface } from '../../interfaces/api/resetPassword.interface';
import { ApiInterceptorService } from '../../services/api-interceptor.service';
import { ResetPasswordService } from '../../services/reset-password.service';

enum Status {
	None,
	FormEmail,
	FormPassword,
	RequestSuccess,
	RequestErrorUser,
	RequestErrorUnknown,
	KeyInvalid,
	ResetErrorUnknown,
	ResetErrorKey,
	ResetSuccess,
}

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
	protected readonly Status = Status;
	protected readonly StatusLayout: Status[] = [Status.None, Status.FormEmail, Status.FormPassword];
	protected readonly StatusSuccess: Status[] = [Status.RequestSuccess, Status.ResetSuccess];
	protected status: Status = Status.None;

	protected email: string = '';
	protected password: string = '';
	private key?: string;

	constructor(
		private readonly cdr: ChangeDetectorRef,
		private readonly route: ActivatedRoute,
		private readonly apiInterceptorService: ApiInterceptorService,
		private readonly resetPasswordService: ResetPasswordService,
	) {}

	ngOnInit() {
		this.apiInterceptorService.addIgnore(/^\/reset-password(\?k=.+)?$/);

		this.key = this.route.snapshot.queryParamMap.get('k') || undefined;
		if (this.key) {
			this.evaluateKey().then((valid) => {
				if (valid) this.status = this.Status.FormPassword;
				else this.status = this.Status.KeyInvalid;
			});
		} else this.status = this.Status.FormEmail;
	}

	detectChanges() {
		this.cdr.detectChanges();
	}

	requestPasswordReset() {
		this.resetPasswordService.requestPasswordReset(this.email).subscribe((result: RequestPasswordResetInterface) => {
			this.status = result.success
				? this.Status.ResetSuccess
				: result.reason === 'USER_DOES_NOT_EXIST'
				? this.Status.RequestErrorUser
				: result.reason === 'UNKNOWN'
				? this.Status.RequestErrorUnknown
				: this.Status.FormEmail;
		});
	}

	evaluateKey() {
		return new Promise((resolve) => {
			if (!this.key) resolve(false);
			else
				this.resetPasswordService.evaluateKey(this.key).subscribe((result) => {
					if (result.valid) {
						this.key = result.privateKey;
						resolve(true);
					} else resolve(false);
				});
		});
	}

	resetPassword() {
		if (this.key) {
			this.resetPasswordService.resetPassword(this.key, this.password).subscribe((result: ResetPasswordInterface) => {
				this.status = result.success
					? this.Status.ResetSuccess
					: result.reason === 'INVALID_KEY'
					? this.Status.ResetErrorKey
					: result.reason === 'UNKNOWN'
					? this.Status.ResetErrorUnknown
					: this.Status.FormPassword;
			});
		}
	}
}
