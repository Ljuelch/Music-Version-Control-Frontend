import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ProjectChecklistComponentEntry as ProjectChecklistComponentEntryInterface } from '../../interfaces/projectChecklistComponentEntry.interface';
import { ProjectChecklistEntry as ProjectChecklistEntryInterface } from '../../interfaces/projectChecklistEntry.interface';
import { ProjectVersion as ProjectVersionInterface } from '../../interfaces/projectVersion.interface';
import { ProjectChecklistService } from '../../services/project-checklist.service';
import { ProjectService } from '../../services/project.service';

@Component({
	selector: 'app-version-changes-table',
	templateUrl: './version-changes-table.component.html',
	styleUrls: ['./version-changes-table.component.scss'],
})
export class VersionChangesTableComponent implements OnChanges {
	@Input() project_id!: number;
	@Input() versionNumber!: number;
	@Input() lastVersion?: ProjectVersionInterface;

	@Output() readonly fetching: EventEmitter<void> = new EventEmitter<void>();
	@Output() readonly entriesChanged: EventEmitter<void> = new EventEmitter<void>();

	protected entries: ProjectChecklistComponentEntryInterface[] = [];

	showTable: boolean = false;
	loading: boolean = false;

	get hasEntries(): boolean {
		return !!this.entries.length;
	}

	constructor(
		protected readonly projectService: ProjectService,
		private readonly projectChecklistService: ProjectChecklistService,
	) {}

	ngOnChanges(changes: SimpleChanges) {
		this.showTable = !!(this.project_id && this.versionNumber && this.versionNumber > 1);
		if ((changes['project_id'] || changes['versionNumber']) && this.project_id && this.versionNumber)
			this.fetchEntries().then();
	}

	private fetchEntries() {
		return new Promise<void>((resolve) => {
			this.fetching.emit();
			if (this.showTable) {
				this.loading = true;
				this.projectChecklistService
					.getProjectChecklistEntries(this.project_id, this.versionNumber - 1, true)
					.subscribe((result) => {
						if (result.success)
							this.entries = result.entries
								.map((entry: ProjectChecklistEntryInterface) => {
									entry.timestamp = new Date(entry.timestamp);
									return entry;
								})
								.sort((entryA, entryB) => entryB.timestamp.getTime() - entryA.timestamp.getTime())
								.map(
									(entry: ProjectChecklistEntryInterface) =>
										({
											new: false,
											editing: false,
											entry,
										}) as ProjectChecklistComponentEntryInterface,
								);
						this.entriesChanged.emit();
						this.loading = false;
						resolve();
					});
			} else {
				this.entries = [];
				this.entriesChanged.emit();
				resolve();
			}
		});
	}
}
