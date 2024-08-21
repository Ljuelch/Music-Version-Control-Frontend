import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Project as ProjectInterface } from '../../interfaces/project.interface';
import { ProjectStem as ProjectStemInterface } from '../../interfaces/projectStem.interface';
import { ProjectStemTableStem as ProjectStemTableStemInterface } from '../../interfaces/projectStemTableStem.interface';
import { FileUploadService } from '../../services/file-upload.service';
import { StemsService } from '../../services/stems.service';
import { TopBannerService } from '../../services/top-banner.service';
import { TranslationService } from '../../services/translation.service';

@Component({
	selector: 'app-project-stems-table',
	templateUrl: './project-stems-table.component.html',
	styleUrls: ['./project-stems-table.component.scss'],
})
export class ProjectStemsTableComponent implements OnInit, OnChanges, OnDestroy {
	private readonly FILE_ACCEPT = '.wav, .aiff';
	protected readonly SPLIT_NAME_PREFIX = '...';

	@Input() project_id!: number;
	@Input() versionNumber!: number;
	@Input() projectInfo!: ProjectInterface;

	@Input() allowEditing: boolean = false;

	@Output() checkboxChange = new EventEmitter<void>();

	showSplitNames: boolean = true;
	loading: boolean = false;

	projectStems: ProjectStemTableStemInterface[] = [];

	private topBannerSubscription?: Subscription;

	get selectedStems(): ProjectStemTableStemInterface[] {
		return this.projectStems.filter(({ selected }) => selected);
	}

	get allStemsSelected(): boolean {
		return !!(this.projectStems.length && this.selectedStems.length === this.projectStems.length);
	}

	get stemsZipFileNameSuffix() {
		return (
			' Stems ' +
			new Date()
				.toLocaleString('de-DE', {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
					hour: '2-digit',
					minute: '2-digit',
				})
				.replaceAll(',', '') +
			'.zip'
		);
	}

	get stemsHasSplitNames(): boolean {
		return (
			this.projectStems.map(({ name }) => name).join() !== this.projectStems.map(({ shortName }) => shortName).join()
		);
	}

	get showStemsSplitNamesToggle(): boolean {
		return this.stemsHasSplitNames && !this.projectStems.some(({ shortName }) => !shortName);
	}

	constructor(
		private readonly toastr: ToastrService,
		private readonly stemsService: StemsService,
		private readonly topBannerService: TopBannerService,
		private readonly translationService: TranslationService,
		private readonly fileUploadService: FileUploadService,
	) {}

	ngOnInit() {
		this.subscribeToTopBannerService();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['project_id'] || changes['versionNumber']) {
			this.loading = true;
			this.fetchProjectStems().then(() => {
				this.loading = false;
			});
		}
	}

	ngOnDestroy() {
		this.unsubscribeFromTopBannerService();
	}

	private subscribeToTopBannerService() {
		this.topBannerSubscription = this.topBannerService.bannerDone$.subscribe(
			(result: { type: string; data: { project_id: number; versionNumber: number } }) => {
				if (
					result.type === 'upload-stems' &&
					result.data.project_id === this.project_id &&
					result.data.versionNumber === this.versionNumber
				) {
					this.loading = true;
					this.fetchProjectStems().then(() => {
						this.loading = false;
					});
				}
			},
		);
	}

	private unsubscribeFromTopBannerService() {
		this.topBannerSubscription?.unsubscribe();
	}

	fetchProjectStems() {
		return new Promise<void>((resolve) => {
			this.stemsService.getStems(this.project_id, this.versionNumber).subscribe((result) => {
				if (result.success)
					this.projectStems = this.shortenStemsNames(result.stems).map((projectStem) => ({
						...projectStem,
						selected: false,
					}));
				else console.error('could not load project stems:', result.reason);
				resolve();
			});
		});
	}

	selectAllStems(selected: boolean = true) {
		for (const projectStem of this.projectStems) projectStem.selected = selected;
	}

	toggleShowSplitNames() {
		this.showSplitNames = !this.showSplitNames;
	}

	private shortenStemsNames(stems: ProjectStemInterface[]): ProjectStemTableStemInterface[] {
		const splitStems = stems.map((stem) => ({
			stem,
			splitName: stem.name.split(' '),
		}));

		const commonPrefix =
			stems.length <= 1
				? []
				: splitStems.reduce((prefix, currentStems) => {
						let i = 0;
						while (
							i < prefix.length &&
							i < currentStems.splitName.length &&
							prefix[i].toUpperCase() === currentStems.splitName[i].toUpperCase()
						)
							i++;
						return prefix.slice(0, i);
				  }, splitStems[0].splitName || []);

		return splitStems.map(
			(splitStem) =>
				({
					...splitStem.stem,
					shortName: splitStem.splitName.slice(commonPrefix.length).join(' ').trimStart(),
				}) as ProjectStemTableStemInterface,
		);
	}

	protected getTypeName(projectStem: ProjectStemTableStemInterface): string | undefined {
		return {
			wav: 'WAV',
			aif: 'AIFF',
			mp3: 'MP3',
		}[projectStem.type];
	}

	selectFiles() {
		this.fileUploadService.selectFile({ multiple: true, accept: this.FILE_ACCEPT }).subscribe(async (files) => {
			if (files?.length) await this.uploadStems(files);
		});
	}

	private async uploadStems(files: FileList) {
		return new Promise<void>((resolve) => {
			console.groupCollapsed('Uploading Stems:', files);
			const banner = this.topBannerService.addBanner({
				icon: 'file-arrow-up',
				title: this.translationService.getTranslation('_topBanner.uploadStems.uploading.title'),
				text: this.translationService.getTranslation('_topBanner.uploadStems.uploading.text', {
					fileCount: files.length.toString(),
					doneCount: '0',
				}),
				progress: 0,
				onDoneData: {
					type: 'upload-stems',
					data: {
						project_id: this.project_id,
						versionNumber: this.versionNumber,
					},
				},
			});

			const subscription = this.stemsService.uploadStems(this.project_id, this.versionNumber, files).subscribe(
				(event) => {
					//console.log('Progress:', event);
					banner.progress = event.alloverProgress;
					banner.text = this.translationService.getTranslation('_topBanner.uploadStems.uploading.text', {
						fileCount: event.fileCount.toString(),
						doneCount: event.doneCount.toString(),
					});
				},
				(error) => {
					subscription.unsubscribe();
					console.groupEnd();
					console.error('Error uploading stem:', error);
					banner.icon = 'triangle-exclamation';
					banner.title = this.translationService.getTranslation('_topBanner.uploadStems.error.title');
					banner.text = this.translationService.getTranslation('_topBanner.uploadStems.error.text', {
						projectName: this.projectInfo.name,
					});
					banner.progress = undefined;
					this.toastr.error(
						this.translationService.getTranslation('_toastr.uploadStems.error.message', {
							projectName: this.projectInfo.name,
						}),
						this.translationService.getTranslation('_toastr.uploadStems.error.title'),
					);
					setTimeout(() => {
						this.topBannerService.removeBanner(banner);
					}, 1e4);
					resolve();
				},
				() => {
					console.info('Stems uploaded');
					console.groupEnd();
					this.topBannerService.doneBanner(banner);
					this.topBannerService.removeBanner(banner);
					this.toastr.success(
						this.translationService.getTranslation('_toastr.uploadStems.success.message', {
							projectName: this.projectInfo.name,
						}),
						this.translationService.getTranslation('_toastr.uploadStems.success.title'),
					);
					resolve();
				},
			);
		});
	}

	protected downloadStem(stemId: number) {
		const banner = this.topBannerService.addBanner({
			icon: 'file-arrow-down',
			title: this.translationService.getTranslation('_topBanner.downloadStem.preparing.title'),
			text: this.translationService.getTranslation('_topBanner.downloadStem.preparing.text'),
			progress: 0,
		});

		this.stemsService.downloadStem(stemId).then((result) => {
			if (result) {
				banner.title = this.translationService.getTranslation('_topBanner.downloadStem.downloading.title');
				banner.text = this.translationService.getTranslation('_topBanner.downloadStem.downloading.text', {
					fileName: result.name,
				});

				const subscription = result.download.subscribe(
					({ event }) => {
						if (event.type === HttpEventType.DownloadProgress) banner.progress = event.loaded / event.total!;
					},
					(error) => {
						subscription.unsubscribe();
						console.error('Error downloading stem:', error);
						banner.icon = 'triangle-exclamation';
						banner.title = this.translationService.getTranslation('_topBanner.downloadStem.error.title');
						banner.text = this.translationService.getTranslation('_topBanner.downloadStem.error.text');
						banner.progress = undefined;
						setTimeout(() => {
							this.topBannerService.removeBanner(banner);
						}, 1e4);
					},
					() => {
						this.topBannerService.removeBanner(banner);
					},
				);
			} else {
				console.error('Error downloading stem:', new Error('empty result form StemsService.downloadStem(...)'));
				banner.icon = 'triangle-exclamation';
				banner.title = this.translationService.getTranslation('_topBanner.downloadStem.error.title');
				banner.text = this.translationService.getTranslation('_topBanner.downloadStem.error.text');
				banner.progress = undefined;
				setTimeout(() => {
					this.topBannerService.removeBanner(banner);
				}, 1e4);
			}
		});
	}

	protected downloadStems(stemIds: number[]) {
		const banner = this.topBannerService.addBanner({
			icon: 'file-arrow-down',
			title: this.translationService.getTranslation('_topBanner.downloadStems.downloading.title'),
			text: this.translationService.getTranslation('_topBanner.downloadStems.downloading.text'),
			progress: 0,
		});

		const subscription = this.stemsService
			.downloadStems(stemIds, this.projectInfo.name + this.stemsZipFileNameSuffix)
			.subscribe(
				(event) => {
					banner.progress = event.alloverProgress;
					banner.text = this.translationService.getTranslation('_topBanner.downloadStems.downloading.text', {
						fileCount: event.fileCount.toString(),
						doneCount: event.doneCount.toString(),
					});
				},
				(error) => {
					subscription.unsubscribe();
					console.error('Error downloading stems:', error);
					banner.icon = 'triangle-exclamation';
					banner.title = this.translationService.getTranslation('_topBanner.downloadStems.error.title');
					banner.text = this.translationService.getTranslation('_topBanner.downloadStems.error.text');
					banner.progress = undefined;
					setTimeout(() => {
						this.topBannerService.removeBanner(banner);
					}, 1e4);
				},
				() => {
					this.topBannerService.removeBanner(banner);
				},
			);
	}

	downloadSelectedStems() {
		const selectedStems = this.selectedStems;
		if (selectedStems.length === 1) this.downloadStem(selectedStems[0].id);
		else if (selectedStems.length > 1) this.downloadStems(this.selectedStems.map(({ id }) => id));
	}

	downloadAllStems() {
		this.selectAllStems();
		this.downloadSelectedStems();
	}
}
