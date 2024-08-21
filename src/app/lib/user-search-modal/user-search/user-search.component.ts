import { Component, ElementRef, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { UserSearchAction as UserSearchActionInterface } from '../../../interfaces/action/userSearchAction.interface';
import { User as UserInterface } from '../../../interfaces/user.interface';
import { UserInfoService } from '../../../services/user-info.service';
import { UserSearchService } from '../../../services/user-search.service';

@Component({
	selector: 'app-user-search',
	templateUrl: './user-search.component.html',
	styleUrls: ['./user-search.component.scss'],
})
export class UserSearchComponent {
	private readonly SEARCHBAR_TIMEOUT: number = 400;

	@Input('showClose') showClose: boolean = false;

	@Input('actions') actions: string[] = [];
	@Input('wholeRowClickable') wholeRowClickable: boolean = true;
	@Input('gotoUser') gotoUser: boolean = false;

	@Input('hiddenUsers') hiddenUsers: number[] = [];

	@Output() closeClick = new EventEmitter<void>();
	@Output() actionClick = new EventEmitter<UserSearchActionInterface>();

	@ViewChild('searchbar') protected searchbar!: ElementRef<HTMLInputElement>;

	protected users: UserInterface[] = [];
	protected loading: boolean = false;

	private searchstartTimeout?: number;

	protected get searchbarValue(): string {
		return this.searchbar.nativeElement.value.trim();
	}

	constructor(
		private readonly userSearchService: UserSearchService,
		private readonly userInfoService: UserInfoService,
	) {}

	private filterUsers(users: UserInterface[], exceptedUserIds: number[] = this.hiddenUsers): UserInterface[] {
		return users.filter((user) => !user.id || !exceptedUserIds.includes(user.id));
	}

	protected searchbarKeyup() {
		if (this.searchbarValue) this.startSearchTimeout();
	}

	private startSearchTimeout() {
		clearTimeout(this.searchstartTimeout);
		this.abortSearch();
		this.searchstartTimeout = setTimeout(async () => {
			this.searchstartTimeout = undefined;
			await this.fetchSearch();
		}, this.SEARCHBAR_TIMEOUT) as unknown as number;
	}

	private fetchSearch(): Promise<void> {
		return new Promise<void>((resolve) => {
			this.loading = true;
			this.users = [];
			this.userSearchService.search(this.searchbarValue).subscribe((result) => {
				this.users = this.filterUsers(result);
				this.loading = false;
				resolve();
			});
		});
	}

	private abortSearch() {
		this.userSearchService.cancelSearchRequest();
	}

	protected routeToUser(user_id?: number) {
		this.actionClick.emit();
		if (user_id) this.userInfoService.gotoUser(user_id).then();
	}
}
