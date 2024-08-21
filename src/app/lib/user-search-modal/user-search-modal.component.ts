import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserSearchModal as UserSearchModalInterface } from '../../interfaces/action/modal/userSearchModal.interface';
import { UserSearchAction as UserSearchActionInterface } from '../../interfaces/action/userSearchAction.interface';

@Component({
	selector: 'app-user-search-modal',
	templateUrl: './user-search-modal.component.html',
})
export class UserSearchModalComponent {
	@Output() readonly actionClick = new EventEmitter<UserSearchActionInterface>();

	constructor(
		@Inject(MAT_DIALOG_DATA)
		private data: UserSearchModalInterface,
		private readonly dialogRef: MatDialogRef<UserSearchModalComponent>,
	) {}

	protected get actions(): string[] {
		return this.data.actions || [];
	}

	protected get wholeRowClickable(): boolean {
		return this.data.wholeRowClickable === undefined ? true : this.data.wholeRowClickable;
	}

	protected get gotoUser(): boolean {
		return this.data.gotoUser === undefined ? false : this.data.gotoUser;
	}

	protected get hiddenUsers(): number[] {
		return this.data.hiddenUsers || [];
	}

	protected close() {
		this.dialogRef.close();
	}

	protected actionClicked(action: UserSearchActionInterface) {
		this.actionClick.emit(action);
		if (this.gotoUser) this.dialogRef.close();
	}
}
