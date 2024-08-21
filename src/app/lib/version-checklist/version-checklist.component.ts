import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { ToastrService } from 'ngx-toastr';
import { MarkerListMarkerClick as MarkerListMarkerClickInterface } from '../../interfaces/action/markerListMarkerClick.interface';
import { NewProjectChecklistEntry as NewProjectChecklistEntryInterface } from '../../interfaces/action/newProjectChecklistEntry.interface';
import { ProjectChecklistEntryActionClick } from '../../interfaces/action/projectChecklistEntryActionClick.interface';
import { Marker as MarkerInterface } from '../../interfaces/marker.interface';
import { MarkerListAction as MarkerListActionInterface } from '../../interfaces/markerListAction.interface';
import { MarkerListMarker as MarkerListMarkerInterface } from '../../interfaces/markerListMarker.interface';
import { ProjectChecklistComponentEntry as ProjectChecklistComponentEntryInterface } from '../../interfaces/projectChecklistComponentEntry.interface';
import { ProjectChecklistEntry as ProjectChecklistEntryInterface } from '../../interfaces/projectChecklistEntry.interface';
import { ProjectChecklistEntryAction as ProjectChecklistEntryActionInterface } from '../../interfaces/projectChecklistEntryAction.interface';
import { ProjectChecklistEntryMarker as ProjectChecklistEntryMarkerInterface } from '../../interfaces/projectChecklistEntryMarker.interface';
import { ProjectVersion as ProjectVersionInterface } from '../../interfaces/projectVersion.interface';
import { ProjectChecklistService } from '../../services/project-checklist.service';
import { TranslationService } from '../../services/translation.service';

@Component({
	selector: 'app-version-checklist',
	templateUrl: './version-checklist.component.html',
	styleUrls: ['./version-checklist.component.scss'],
})
export class VersionChecklistComponent implements OnChanges {
	protected readonly MARKER_LIST_ACTIONS: MarkerListActionInterface[] = [
		{
			name: 'COLOR',
			content: '<i class="fa fa-palette"></i>',
			type: 'COLOR',
			global: false,
		},
		{
			name: 'DELETE',
			content: `<i class="fa fa-trash"></i>`,
			class: 'hover-text-danger',
		},
	];

	@Input() project_id!: number;
	@Input() versionNumber!: number;
	@Input() lastVersion?: ProjectVersionInterface;

	@Input() controls: boolean = true;
	@Input() actions: ProjectChecklistEntryActionInterface[] = [];

	@Input() allowEditing: boolean = false;

	@Output() readonly actionClick$ = new EventEmitter<ProjectChecklistEntryActionClick>();
	@Output() readonly markerClick$ = new EventEmitter<ProjectChecklistEntryMarkerInterface>();

	@Output() readonly submitEditingEntry$ = new EventEmitter<{
		entry?: ProjectChecklistComponentEntryInterface;
		newEntry?: NewProjectChecklistEntryInterface;
	}>();
	@Output() readonly discardEditingEntry$ = new EventEmitter<ProjectChecklistComponentEntryInterface | null>();

	protected _entries: ProjectChecklistComponentEntryInterface[] = [];

	loading: boolean = false;
	updating: boolean = false;

	protected readonly showOlderTable: boolean = false;

	get entries(): ProjectChecklistComponentEntryInterface[] {
		return this._entries;
	}

	constructor(
		private readonly elementRef: ElementRef,
		private readonly toastr: ToastrService,
		private readonly translationService: TranslationService,
		private readonly projectChecklistService: ProjectChecklistService,
	) {}

	protected markerClick(marker: MarkerListMarkerInterface) {
		this.markerClick$.emit(marker as ProjectChecklistEntryMarkerInterface);
	}

	protected async markerActionClick(clickAction: MarkerListMarkerClickInterface) {
		switch (clickAction.action.name) {
			case 'COLOR':
				await this.setEntryMarkerColor(clickAction.marker[0]);
				await this.fetchEntries();
				break;

			case 'DELETE':
				if (await this.deleteEntryMarker(clickAction.marker)) await this.fetchEntries();
				break;
		}
	}

	private setEntryMarkerColor(marker: MarkerListMarkerInterface) {
		return new Promise<boolean>((resolve) => {
			this.projectChecklistService.setProjectChecklistEntryMarkerColor(marker).subscribe((result) => {
				if (!result.success) {
					console.error('error setProjectChecklistEntryMarkerColor:', result.reason);
					this.toastr.error(
						this.translationService.getTranslation('_toastr.setProjectChecklistEntryMarkerColor.error', {
							reason: result.reason,
						}),
					);
				}
				resolve(result.success);
			});
		});
	}

	private deleteEntryMarker(marker: MarkerListMarkerInterface[]) {
		return new Promise<boolean>((resolve) => {
			this.projectChecklistService.deleteProjectChecklistEntryMarker(marker).subscribe((result) => {
				if (!result.success) {
					console.error('error deleteProjectChecklistEntryMarker:', result.reason);
					this.toastr.error(
						this.translationService.getTranslation('_toastr.deleteProjectChecklistEntryMarker.error', {
							reason: result.reason,
						}),
					);
				}
				resolve(result.success);
			});
		});
	}

	protected get uncheckedEntries(): ProjectChecklistComponentEntryInterface[] {
		return this._entries.filter(({ entry }) => !entry?.checkedVersionNumber);
	}

	//protected get checkedEntries(): ProjectChecklistComponentEntryInterface[] {
	//	return this.entries.filter(({ entry }) => entry?.checkedVersionNumber);
	//}

	protected checkedEntriesAtVersionNumber(
		versionNumber: number = this.versionNumber,
	): ProjectChecklistComponentEntryInterface[] {
		return this._entries.filter(
			({ entry }) => entry?.checkedVersionNumber && entry.checkedVersionNumber === versionNumber,
		);
	}

	protected checkedEntriesUnderVersionNumber(
		versionNumber: number = this.versionNumber,
	): ProjectChecklistComponentEntryInterface[] {
		return this._entries.filter(
			({ entry }) => entry?.checkedVersionNumber && entry.checkedVersionNumber < versionNumber,
		);
	}

	protected entriesAtVersionNumber(versionNumber: number = this.versionNumber): boolean {
		return !!this.checkedEntriesAtVersionNumber(versionNumber).length;
	}

	protected get editing(): ProjectChecklistComponentEntryInterface | undefined {
		return this._entries.find(({ editing }) => editing !== false);
	}

	get someEditing(): boolean {
		return !!this.editing;
	}

	get editingInput() {
		return this.elementRef.nativeElement.querySelector('.entryRow .input-editing') as HTMLInputElement;
	}

	get staticMarker() {
		let marker: ProjectChecklistEntryMarkerInterface[] = [];
		for (const entry of this._entries)
			if (
				entry.entry &&
				(!entry.entry.checkedVersionNumber || entry.entry.checkedVersionNumber === this.versionNumber) &&
				entry.entry.marker.length
			)
				marker = [...marker, ...entry.entry.marker];
		return marker;
	}

	ngOnChanges(changes: SimpleChanges) {
		if (
			(changes['project_id'] || changes['versionNumber'] || changes['lastVersion']) &&
			this.project_id &&
			this.versionNumber
		) {
			this.loading = true;
			this.fetchEntries().then(() => {
				this.loading = false;
			});
		}
	}

	fetchEntries() {
		return new Promise<void>((resolve) => {
			this.updating = true;
			this.projectChecklistService
				.getProjectChecklistEntries(this.project_id, this.versionNumber, undefined, true)
				.subscribe((result) => {
					if (result.success)
						this._entries = result.entries
							.map(
								(entry: ProjectChecklistEntryInterface) =>
									({
										new: false,
										editing: false,
										startNewEditingAfter: false,
										entry: {
											...entry,
											timestamp: new Date(entry.timestamp),
										},
									}) as ProjectChecklistComponentEntryInterface,
							)
							.sort((entryA, entryB) => entryB.entry!.timestamp.getTime() - entryA.entry!.timestamp.getTime());
					this.updating = false;
					resolve();
				});
		});
	}

	async newEntryInput(
		focusNewEntryInput: boolean = true,
		startNewEditingAfter: boolean = true,
		marker: MarkerInterface[] = [],
	): Promise<ProjectChecklistComponentEntryInterface | undefined> {
		if (!this.allowEditing) return;

		let editingEntry: ProjectChecklistComponentEntryInterface | undefined;
		if (!this.someEditing) {
			editingEntry = {
				new: true,
				editing: '',
				startNewEditingAfter,
				entry: null,
				marker: marker as ProjectChecklistEntryMarkerInterface[],
			};
			this._entries.unshift(editingEntry);
			await this.startEditing(editingEntry, focusNewEntryInput);
		}
		if (focusNewEntryInput) await this.focusEditingInput();
		return editingEntry;
	}

	protected async focusEditingInput(): Promise<boolean> {
		if (!this.allowEditing) return false;

		await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
		const editingInput = this.editingInput;
		editingInput?.focus();
		return !!editingInput;
	}

	protected async startEditing(
		editingEntry: ProjectChecklistComponentEntryInterface,
		focusNewEntryInput: boolean = true,
	) {
		if (!this.allowEditing) return;

		if (!this.someEditing) {
			editingEntry.editing = '';
			await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
			editingEntry.editing = this.editingInput.value;
		}
		if (focusNewEntryInput) await this.focusEditingInput();
	}

	protected stopEditing(
		checkValueChange: boolean = false,
		editingEntry: ProjectChecklistComponentEntryInterface | undefined = this.editing,
	) {
		if (!this.allowEditing) return;

		const editingInputValue = this.editingInput?.value;
		if (
			editingEntry &&
			editingEntry.editing !== false &&
			(!checkValueChange || editingEntry.editing === editingInputValue)
		) {
			editingEntry.editing = false;
			if (editingEntry.new && !editingInputValue) this.discardEditingEntry(editingEntry);
		}
	}

	protected discardEditingEntry(editingEntry: ProjectChecklistComponentEntryInterface | undefined = this.editing) {
		if (!this.allowEditing || !editingEntry) this.discardEditingEntry$.emit(null);
		else {
			this.discardEditingEntry$.emit(editingEntry);
			if (editingEntry.new) this._entries.splice(this._entries.indexOf(editingEntry), 1);
			else {
				if (editingEntry.editing !== false) this.editingInput.value = editingEntry.editing;
				this.stopEditing();
			}
		}
	}

	private loadNewEntryData(entry: ProjectChecklistComponentEntryInterface): NewProjectChecklistEntryInterface {
		return {
			text: this.editingInput.value || entry.entry?.text || '',
			marker: (entry.marker || []).map((marker) => ({
				user: marker.user,
				color: marker.color,
				start: marker.start,
				end: marker.end,
			})),
		} as NewProjectChecklistEntryInterface;
	}

	protected submitEditingEntry() {
		return new Promise<void | {
			entry: ProjectChecklistComponentEntryInterface;
			newEntry?: NewProjectChecklistEntryInterface;
		}>(async (resolve) => {
			if (!this.allowEditing) return resolve();

			const entry = this.editing;
			const newEntry = this.loadNewEntryData(entry!);
			if (entry && newEntry.text) {
				this.updating = true;
				this.stopEditing();

				if (entry.new)
					this.projectChecklistService
						.addProjectChecklistEntry(this.project_id, this.versionNumber, newEntry)
						.subscribe(async (/*{success}*/) => {
							await this.fetchEntries();
							this.submitEditingEntry$.emit({ entry, newEntry });
							resolve({ entry, newEntry });
						});
				else if (entry.entry?.id)
					this.projectChecklistService
						.renameProjectChecklistEntry(entry.entry?.id, newEntry.text)
						.subscribe(async (/*{success}*/) => {
							await this.fetchEntries();
							this.submitEditingEntry$.emit({ entry, newEntry });
							resolve({ entry, newEntry });
						});
				else {
					await this.fetchEntries();
					this.submitEditingEntry$.emit({ entry, newEntry });
					resolve({ entry, newEntry });
				}
			} else {
				this.submitEditingEntry$.emit({});
				if (entry) resolve({ entry });
				else resolve();
			}
		});
	}

	protected checklistEntryEnter() {
		this.submitEditingEntry().then(async (result) => {
			if (result?.entry.startNewEditingAfter && result?.newEntry?.text) await this.newEntryInput();
		});
	}

	protected setEntryChecked(entry: ProjectChecklistComponentEntryInterface): boolean {
		if (this.allowEditing && entry.entry?.id) {
			this.updating = true;
			this.projectChecklistService
				.checkProjectChecklistEntry(entry.entry.id)
				.subscribe(async () => await this.fetchEntries());
			return true;
		}
		return false;
	}

	protected setEntryUnchecked(entry: ProjectChecklistComponentEntryInterface): boolean {
		if (this.allowEditing && entry.entry?.id && entry.entry.checkedVersionNumber === this.lastVersion?.versionNumber) {
			this.updating = true;
			this.projectChecklistService
				.uncheckProjectChecklistEntry(entry.entry.id)
				.subscribe(async () => await this.fetchEntries());
			return true;
		}
		return false;
	}

	protected checkedEntryCheckboxClick(checkbox: MatCheckbox, entry: ProjectChecklistComponentEntryInterface) {
		if (!this.setEntryUnchecked(entry)) checkbox.checked = true;
	}

	protected entryActionClick(
		event: Event,
		action: ProjectChecklistEntryActionInterface,
		entry: ProjectChecklistComponentEntryInterface,
	) {
		this.actionClick$.emit({ event, action, entry });
	}

	async blinkActionButton(button: HTMLElement, color: string) {
		const _color = (color.startsWith('#') ? '' : '#') + color;

		button.classList.remove('fading');
		await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

		button.style.color = _color;
		button.style.textShadow = '0 0 18px ' + _color;
		await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

		button.classList.add('fading');
		button.style.color = '';
		button.style.textShadow = '';
		await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
	}
}
