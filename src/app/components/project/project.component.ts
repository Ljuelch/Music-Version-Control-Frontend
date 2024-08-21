import {
	Component,
	OnInit,
	AfterViewInit,
	OnChanges,
	HostListener,
	ViewChild,
	ElementRef,
	OnDestroy,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { NewProjectVersionModal as NewProjectVersionModalInterface } from '../../interfaces/action/modal/newProjectVersionModal.interface';
import { ProjectProjectChecklistEntryActionClick as ProjectProjectChecklistEntryActionClickInterface } from '../../interfaces/action/projectProjectChecklistEntryActionClick.interface';
import { UserSearchAction as UserSearchActionInterface } from '../../interfaces/action/userSearchAction.interface';
import { Marker as MarkerInterface } from '../../interfaces/marker.interface';
import { MarkerListMarker as MarkerListMarkerInterface } from '../../interfaces/markerListMarker.interface';
import { Project as ProjectInterface } from '../../interfaces/project.interface';
import { ProjectChecklistEntryMarker as ProjectChecklistEntryMarkerInterface } from '../../interfaces/projectChecklistEntryMarker.interface';
import { ProjectInfo as ProjectInfoInterface } from '../../interfaces/projectInfo.interface';
import { ProjectProjectChecklistEntryAction as ProjectProjectChecklistEntryActionInterface } from '../../interfaces/projectProjectChecklistEntryAction.interface';
import { ProjectVersion as ProjectVersionInterface } from '../../interfaces/projectVersion.interface';
import { ProjectUserRole } from '../../interfaces/types/projectUserRole.type';
import { NewProjectVersionModalComponent } from '../../lib/new-project-version-modal/new-project-version-modal.component';
import { ProjectContributorsTableComponent } from '../../lib/project-contributors-table/project-contributors-table.component';
import { ProjectStemsTableComponent } from '../../lib/project-stems-table/project-stems-table.component';
import { UserSearchModalComponent } from '../../lib/user-search-modal/user-search-modal.component';
import { VersionChangesTableComponent } from '../../lib/version-changes-table/version-changes-table.component';
import { VersionChecklistComponent } from '../../lib/version-checklist/version-checklist.component';
import { WaveformPlayerControlsLargeComponent } from '../../lib/waveform-player/waveform-player-controls-large/waveform-player-controls-large.component';
import { ColorService } from '../../services/color.service';
import { ProjectChecklistService } from '../../services/project-checklist.service';
import { ProjectService } from '../../services/project.service';
import { TopBannerService } from '../../services/top-banner.service';
import { TranslationService } from '../../services/translation.service';
import { ROLE_ICON } from '../../shared/roleIcon';

@Component({
	selector: 'app-project',
	templateUrl: './project.component.html',
	styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
	protected readonly CHECKLIST_ACTIONS: ProjectProjectChecklistEntryActionInterface[] = [
		{
			name: 'MARKER',
			content: `<i class="fa fa-filter"></i>`,
		},
		{
			name: 'DELETE',
			content: `<i class="fa fa-trash"></i>`,
			class: 'hover-text-danger',
		},
	];

	@ViewChild(WaveformPlayerControlsLargeComponent, { static: true })
	private waveformPlayerControlsLargeComponent!: WaveformPlayerControlsLargeComponent;

	@ViewChild(VersionChangesTableComponent)
	protected versionChangesTableComponent?: VersionChangesTableComponent;

	@ViewChild(ProjectContributorsTableComponent)
	protected projectContributorsTableComponent?: ProjectContributorsTableComponent;

	@ViewChild(VersionChecklistComponent)
	protected versionChecklistComponent?: VersionChecklistComponent;

	@ViewChild(ProjectStemsTableComponent)
	protected projectStemsTableComponent?: ProjectStemsTableComponent;

	@ViewChild('versionChangesTableContainer')
	private versionChangesTableContainer?: ElementRef<HTMLDivElement>;

	private contributorsUserSearchModal?: MatDialogRef<UserSearchModalComponent>;

	private readonly contributorsUserSearchActions = Object.values(ROLE_ICON);

	protected versionChangesContainerOpen: boolean = true;
	protected leftSideOpen: boolean = true;

	protected project_id?: number;
	protected versionNumber?: number;
	protected info: ProjectInfoInterface = { versions: [] };

	protected currentVersion?: ProjectVersionInterface;

	protected loading: boolean = false;

	private topBannerSubscription?: Subscription;

	protected get projectInfo(): ProjectInterface {
		return this.info as ProjectInterface;
	}

	protected get isSpectator(): boolean {
		return !this.projectContributorsTableComponent?.isSelfRole(['O', 'A']);
	}

	constructor(
		private readonly route: ActivatedRoute,
		private readonly dialog: MatDialog,
		private readonly colorService: ColorService,
		private readonly toastr: ToastrService,
		private readonly topBannerService: TopBannerService,
		private readonly translationService: TranslationService,
		private readonly projectService: ProjectService,
		private readonly projectChecklistService: ProjectChecklistService,
	) {}

	ngOnInit() {
		this.loading = true;

		this.route.params.subscribe((params) => {
			this.project_id = +params['project_id'];
			this.versionNumber = +params['versionNumber'];

			this.subscribeToTopBannerService();
			this.fetchProjectInfo().then();
		});
	}

	ngAfterViewInit() {
		this.versionChangesTableComponent?.fetching.subscribe(
			async () => await this.resetVersionChangesTableContainerHeight(100),
		);
		this.versionChangesTableComponent?.entriesChanged.subscribe(
			async () => await this.resetVersionChangesTableContainerHeight(),
		);
	}

	ngOnChanges() {
		this.resetVersionChangesTableContainerHeight().then();
	}

	@HostListener('window:resize')
	onResize() {
		this.resetVersionChangesTableContainerHeight().then();
	}

	ngOnDestroy() {
		this.unsubscribeFromTopBannerService();
	}

	private fetchProjectInfo() {
		return new Promise<void>((resolve) => {
			if (this.project_id) {
				this.loading = true;
				this.projectService.fetchProjectInfo(this.project_id, this.versionNumber).then((result) => {
					if (result) {
						if (result.lastVersion) this.gotoVersion(result.lastVersion.versionNumber).then();
						else {
							this.info = result.projectInfo;
							this.currentVersion = result.currentVersion;
						}
					}
					this.loading = false;
					resolve();
				});
			} else resolve();
		});
	}

	private subscribeToTopBannerService() {
		this.topBannerSubscription = this.topBannerService.bannerDone$.subscribe((result) => {
			if ((result.type === 'new-project' || result.type === 'new-project-version') && result.data === this.project_id)
				this.fetchProjectInfo().then();
		});
	}

	private unsubscribeFromTopBannerService() {
		this.topBannerSubscription?.unsubscribe();
	}

	protected async gotoVersion(versionNumber: number) {
		if (this.project_id) {
			if (versionNumber !== this.versionNumber) {
				this.loading = true;
				this.waveformPlayerControlsLargeComponent.waveformPlayer.loading = true;
			}
			await this.projectService.gotoProject(this.project_id, versionNumber);
			this.loading = false;
		}
	}

	protected openNewProjectVersionDialog() {
		// TODO: set songBPM and songKey form Modal input fields
		this.dialog.open(NewProjectVersionModalComponent, {
			minWidth: '320px',
			maxWidth: '540px',
			data: {
				projectInfo: this.projectInfo,
				songKey: this.info.lastVersion?.songKey,
				songBPM: this.info.lastVersion?.songBPM,
			} as NewProjectVersionModalInterface,
		});
	}

	protected toggleLeftSideContainer() {
		this.leftSideOpen = !this.leftSideOpen;
	}

	protected toggleVersionChangesContainer() {
		this.versionChangesContainerOpen = !this.versionChangesContainerOpen;
	}

	private async resetVersionChangesTableContainerHeight(height?: number) {
		await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));

		if (this.versionChangesTableContainer?.nativeElement.clientHeight) {
			this.versionChangesTableContainer.nativeElement.classList.remove('transition');
			this.versionChangesTableContainer.nativeElement.style.maxHeight = 'unset';
			await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));

			this.versionChangesTableContainer.nativeElement.style.maxHeight =
				(height || this.versionChangesTableContainer.nativeElement.clientHeight) + 'px';
			await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
			this.versionChangesTableContainer.nativeElement.classList.add('transition');
		}
	}

	protected get contributorsUserIds(): number[] {
		return this.projectContributorsTableComponent?.projectUsers.map((projectUser) => projectUser.user.id) || [];
	}

	protected openContributorsUserSearchModal() {
		this.contributorsUserSearchModal = this.dialog.open(UserSearchModalComponent, {
			width: '100%',
			height: '90%',
			data: {
				actions: this.contributorsUserSearchActions,
				wholeRowClickable: false,
				hiddenUsers: this.contributorsUserIds,
			},
		});
		this.contributorsUserSearchModal.componentInstance.actionClick.subscribe((action) => {
			this.contributorsUserSearchActionClick(action);
		});
	}

	protected closeContributorsUserSearchModal() {
		this.contributorsUserSearchModal?.close();
	}

	protected contributorsUserSearchActionClick(action: UserSearchActionInterface) {
		if (action.user_id !== undefined && action.action !== undefined && this.project_id !== undefined)
			this.projectService
				.addUserToProject(this.project_id, action.user_id, Object.keys(ROLE_ICON)[action.action] as ProjectUserRole)
				.subscribe(() => {
					this.closeContributorsUserSearchModal();
					this.projectContributorsTableComponent?.fetchProjectUsers();
				});
	}

	protected downloadStems() {
		if (this.projectStemsTableComponent) {
			if (this.projectStemsTableComponent.selectedStems.length === 0)
				this.projectStemsTableComponent.downloadAllStems();
			else this.projectStemsTableComponent.downloadSelectedStems();
		}
	}

	protected checklistActionClick(action: ProjectProjectChecklistEntryActionClickInterface) {
		switch (action.action.name) {
			case 'MARKER':
				this.versionChecklistComponent!.updating = true;
				const marker = action.entry.entry!.marker || [],
					newMarker = {
						entryId: action.entry.entry!.id,
						color: this.colorService.getNextColor(marker[marker.length - 1]?.color),
						start: Math.round(this.waveformPlayerControlsLargeComponent.waveformPlayer.player.currentTime * 10) / 10,
					},
					blinkPromise = new Promise<void>(async (resolve) => {
						await this.versionChecklistComponent!.blinkActionButton(
							action.event.currentTarget as HTMLElement,
							newMarker.color,
						);
						await new Promise<void>((resolve) => setTimeout(() => resolve(), 400));
						resolve();
					});
				//this.versionChecklistComponent!.entries.find(
				//	(entry) => entry.entry?.id === action.entry.entry?.id,
				//)?.entry?.marker.push({
				//	id: -1,
				//	color: newMarker.color,
				//	start: newMarker.start,
				//	user: this.projectContributorsTableComponent!.selfProjectUser!.user,
				//} as ProjectChecklistEntryMarkerInterface);
				this.projectChecklistService
					.addProjectChecklistEntryMarker(newMarker.entryId, newMarker.color, newMarker.start)
					.subscribe(async (result) => {
						if (!result.success) {
							console.error('error addProjectChecklistEntryMarker:', result.reason);
							this.toastr.error(
								this.translationService.getTranslation('_toastr.addProjectChecklistEntryMarker.error', {
									reason: result.reason,
								}),
							);
						} else {
							await blinkPromise;
							await this.versionChecklistComponent!.fetchEntries();
						}
					});
				break;

			case 'DELETE':
				this.projectChecklistService.deleteProjectChecklistEntry(action.entry.entry!.id).subscribe(async (result) => {
					if (!result.success) {
						console.error('error deleteProjectChecklistEntry:', result.reason);
						this.toastr.error(
							this.translationService.getTranslation('_toastr.deleteProjectChecklistEntry.error', {
								reason: result.reason,
							}),
						);
					} else await this.versionChecklistComponent!.fetchEntries();
				});
				break;
		}
	}

	protected get staticMarker(): ProjectChecklistEntryMarkerInterface[] {
		return this.versionChecklistComponent?.staticMarker || [];
	}

	protected seekToMarker(marker: ProjectChecklistEntryMarkerInterface) {
		this.waveformPlayerControlsLargeComponent.waveformPlayer.seekToMarker(marker);
	}

	protected async addMarkerToChecklist(marker: MarkerListMarkerInterface[]) {
		if (this.versionChecklistComponent) {
			marker = marker.map((_marker) => ({ ..._marker }) as MarkerListMarkerInterface);
			const newEntry = await this.versionChecklistComponent.newEntryInput(true, false, marker as MarkerInterface[]);
			if (newEntry) {
				if (this.versionChecklistComponent.editingInput)
					this.versionChecklistComponent.editingInput.value = marker.find((_marker) => _marker.text)?.text || '';

				const submitEditingEntrySubscription = this.versionChecklistComponent.submitEditingEntry$.subscribe(
					(entries) => {
						submitEditingEntrySubscription.unsubscribe();
						discardEditingEntrySubscription?.unsubscribe();

						if (entries.entry?.new || (entries.entry?.entry?.id && entries.entry?.entry?.id === newEntry.entry?.id))
							this.waveformPlayerControlsLargeComponent.deleteMarker(marker);
					},
				);
				const discardEditingEntrySubscription = this.versionChecklistComponent.discardEditingEntry$.subscribe(() => {
					submitEditingEntrySubscription.unsubscribe();
					discardEditingEntrySubscription.unsubscribe();
				});
			}
		}
	}
}
