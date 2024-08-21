import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class AccountSettingsService {
	private selectedSectionSubject = new BehaviorSubject<string>('Account');

	setSelectedSection(section: string) {
		this.selectedSectionSubject.next(section);
	}
}
