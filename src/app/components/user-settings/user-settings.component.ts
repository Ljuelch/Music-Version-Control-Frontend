import { Component } from '@angular/core';
import { AccountSettingsService } from '../../services/account-settings.service';

@Component({
	selector: 'app-user-settings',
	templateUrl: './user-settings.component.html',
	styleUrls: ['./user-settings.component.scss'],
})
export class UserSettingsComponent {
	selectedSection: string = 'Account';
	constructor(private accountService: AccountSettingsService) {}
	onRowClick(section: string) {
		this.selectedSection = section;
		this.accountService.setSelectedSection(section);
	}
}
