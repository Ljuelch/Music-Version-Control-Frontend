import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegisterUser as RegisterUserInterface } from '../../interfaces/action/registerUser.interface';
import { ApiInterceptorService } from '../../services/api-interceptor.service';
import { LoginStateService } from '../../services/login-state.service';
import { RegistrationService } from '../../services/registration.service';
import { TranslationService } from '../../services/translation.service';

enum FormEvaluation {
	VALID = 0,
	INVALID_USERNAME,
	INVALID_EMAIL,
	INVALID_PASSWORD,
	INVALID_PASSWORD_REPEAT,
	INVALID_FIRSTNAME,
	INVALID_LASTNAME,
	AGB_UNCHECKED,
}

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
	protected readonly FormEvaluation = FormEvaluation;

	@ViewChild('passwordRepeatInput', { static: true }) private passwordRepeatInput!: ElementRef<HTMLInputElement>;
	@ViewChild('agb', { static: true }) private agbCheckbox!: MatCheckbox;

	userData: RegisterUserInterface = {
		email: '',
		username: '',
		password: '',
		firstname: '',
		lastname: '',
	};
	constructor(
		private readonly router: Router,
		protected readonly cdr: ChangeDetectorRef,
		private readonly toastr: ToastrService,
		private readonly translationService: TranslationService,
		private readonly apiInterceptorService: ApiInterceptorService,
		private readonly registrationService: RegistrationService,
		private readonly loginStateService: LoginStateService,
	) {}

	ngOnInit() {
		this.apiInterceptorService.addIgnore(/^\/register$/);
	}

	protected evaluateForm(): FormEvaluation {
		if (!this.userData.username) return FormEvaluation.INVALID_USERNAME;
		if (!this.userData.email) return FormEvaluation.INVALID_EMAIL;
		if (!this.userData.password) return FormEvaluation.INVALID_PASSWORD;
		if (!this.userData.firstname) return FormEvaluation.INVALID_FIRSTNAME;
		if (!this.userData.lastname) return FormEvaluation.INVALID_LASTNAME;
		if (!this.agbCheckbox.checked) return FormEvaluation.AGB_UNCHECKED;
		if (this.userData.password !== this.passwordRepeatInput.nativeElement.value)
			return FormEvaluation.INVALID_PASSWORD_REPEAT;
		return FormEvaluation.VALID;
	}

	protected register(event: SubmitEvent) {
		const formEvaluation = this.evaluateForm();
		switch (formEvaluation) {
			case FormEvaluation.INVALID_USERNAME:
				this.toastr.error(this.translationService.getTranslation('_toastr.register.errorUsername'));
				break;
			case FormEvaluation.INVALID_EMAIL:
				this.toastr.error(this.translationService.getTranslation('_toastr.register.errorEmail'));
				break;
			case FormEvaluation.INVALID_PASSWORD:
				this.toastr.error(this.translationService.getTranslation('_toastr.register.errorPassword'));
				break;
			case FormEvaluation.INVALID_PASSWORD_REPEAT:
				this.toastr.error(this.translationService.getTranslation('_toastr.register.errorPasswordRepeat'));
				break;
			case FormEvaluation.INVALID_FIRSTNAME:
				this.toastr.error(this.translationService.getTranslation('_toastr.register.errorFirstname'));
				break;
			case FormEvaluation.INVALID_LASTNAME:
				this.toastr.error(this.translationService.getTranslation('_toastr.register.errorLastname'));
				break;
			case FormEvaluation.AGB_UNCHECKED:
				this.toastr.error(this.translationService.getTranslation('_toastr.register.errorAgb'));
				break;
		}
		if (formEvaluation !== FormEvaluation.VALID) return event.preventDefault();

		this.registrationService
			.registerUser({
				email: this.userData.email,
				username: this.userData.username,
				password: this.userData.password,
				firstname: this.userData.firstname,
				lastname: this.userData.lastname,
			})
			.subscribe(
				(response) => {
					if (!response.success) {
						switch (response.reason) {
							case 'USERNAME_ALREADY_TAKEN':
								return void this.toastr.error(
									this.translationService.getTranslation('_toastr.register.errorUsernameTaken'),
								);
							case 'EMAIL_ALREADY_TAKEN':
								return void this.toastr.error(
									this.translationService.getTranslation('_toastr.register.errorEmailTaken'),
								);
							default:
								return void this.toastr.error(this.translationService.getTranslation('_toastr.register.errorUnknown'));
						}
					}
					this.toastr.success(
						this.translationService.getTranslation('_toastr.register.success.message'),
						this.translationService.getTranslation('_toastr.register.success.title'),
					);
					this.router.navigate(['/login']).then();
				},
				(error) => {
					console.error('Registration failed', error);
					this.toastr.error(this.translationService.getTranslation('_toastr.register.errorUnknown'));
				},
			);
	}

	protected gotoLogin() {
		this.loginStateService.setShowLogin(false);
	}
}
