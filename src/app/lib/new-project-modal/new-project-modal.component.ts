import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FileUploadService } from '../../services/file-upload.service';
import { ProjectService } from '../../services/project.service';
import { TopBannerService } from '../../services/top-banner.service';
import { TranslationService } from '../../services/translation.service';
import { SharpFlat, ToneOptions, Vibe } from '../../shared/tonalityFeatures';

@Component({
	selector: 'app-new-project-modal',
	templateUrl: './new-project-modal.component.html',
})
export class NewProjectModalComponent {
	protected readonly KEY_TONE_OPTIONS = Object.values(ToneOptions);
	protected readonly KEY_SHARP_FLAT_OPTIONS = Object.values(SharpFlat);
	protected readonly KEY_VIBE_OPTIONS = Object.values(Vibe);

	protected tone: string = '';
	protected sharpFlat: string = '';
	protected vibe: string = '';
	private get songKey(): string {
		return `${this.tone}${this.sharpFlat} ${this.vibe}`.trim();
	}

	protected projectName?: string;
	protected songBPM?: number;
	private project_id?: number;
	private versionNumber?: number;

	@ViewChild('audioFileInput')
	private audioFileInput?: ElementRef<HTMLInputElement>;
	private get audioFile(): File | undefined {
		return this.audioFileInput?.nativeElement.files?.[0];
	}

	get projectNameFormatted(): string {
		return this.projectName?.trim() || '';
	}

	get filled(): boolean {
		return !!this.projectNameFormatted;
	}

	constructor(
		private readonly toastr: ToastrService,
		private readonly dialogRef: MatDialogRef<NewProjectModalComponent>,
		private readonly translationService: TranslationService,
		private readonly topBannerService: TopBannerService,
		private readonly projectService: ProjectService,
		private readonly fileUpload: FileUploadService,
	) {}

	protected submit() {
		return new Promise<void>((resolve) => {
			const projectName = this.projectNameFormatted;
			const audioFile = this.audioFile;
			this.close();

			if (projectName) {
				const banner = this.topBannerService.addBanner({
					icon: 'file-arrow-up',
					title: this.translationService.getTranslation('_topBanner.newProject.create.title'),
					text: this.translationService.getTranslation('_topBanner.newProject.create.text', { projectName }),
					progress: audioFile ? null : undefined,
					onDoneData: { type: 'new-project' },
				});

				this.projectService
					.createProject({
						name: projectName,
						songBPM: this.songBPM,
						songKey: this.songKey,
					})
					.subscribe(
						async (response) => {
							if (response.success && response.project_id && response.versionNumber) {
								console.log('Project created:', response);
								this.project_id = response.project_id;
								this.versionNumber = response.versionNumber;
								banner.onDoneData!.data = this.project_id;
								await this.projectService.gotoProject(this.project_id, this.versionNumber);

								if (audioFile) {
									console.groupCollapsed('Uploading Audio File:', audioFile.name);
									banner.title = this.translationService.getTranslation('_topBanner.newProject.fileUploading.title');
									banner.text = this.translationService.getTranslation('_topBanner.newProject.fileUploading.text', {
										fileName: audioFile.name,
										projectName,
									});
									banner.progress = 0;

									this.fileUpload.uploadAudioFile(this.project_id, this.versionNumber, audioFile).subscribe(
										(event) => {
											switch (event.type) {
												case HttpEventType.UploadProgress:
													const progress = event.loaded / event.total!;
													console.log('Progress:', Math.round(progress * 100));
													banner.progress = progress;

													if (progress >= 1) {
														banner.title = this.translationService.getTranslation(
															'_topBanner.newProject.preparing.title',
														);
														banner.text = this.translationService.getTranslation(
															'_topBanner.newProject.preparing.text',
															{ projectName },
														);
														banner.progress = null;
													}
													break;

												case HttpEventType.Response:
													console.groupEnd();
													console.info('File uploaded:', response);
													this.topBannerService.doneBanner(banner);
													this.topBannerService.removeBanner(banner);
													this.toastr.success(
														this.translationService.getTranslation('_toastr.newProject.success.message', {
															projectName,
														}),
														this.translationService.getTranslation('_toastr.newProject.success.title'),
													);
													resolve();
													break;
											}
										},
										(error) => {
											console.error('Error uploading file:', error);
											banner.icon = 'triangle-exclamation';
											banner.title = this.translationService.getTranslation(
												'_topBanner.newProject.fileUploadError.title',
											);
											banner.text = this.translationService.getTranslation(
												'_topBanner.newProject.fileUploadError.text',
												{
													fileName: audioFile.name,
													projectName,
												},
											);
											banner.progress = undefined;
											this.toastr.error(
												this.translationService.getTranslation('_toastr.newProject.fileUploadError.message', {
													fileName: audioFile.name,
													projectName,
												}),
												this.translationService.getTranslation('_toastr.newProject.fileUploadError.title'),
											);
											setTimeout(() => {
												this.topBannerService.removeBanner(banner);
											}, 1e4);
											resolve();
										},
									);
								} else {
									this.topBannerService.doneBanner(banner);
									this.topBannerService.removeBanner(banner);
									this.toastr.success(
										this.translationService.getTranslation('_toastr.newProject.success.message', {
											projectName,
										}),
										this.translationService.getTranslation('_toastr.newProject.success.title'),
									);
									resolve();
								}
							} else {
								banner.icon = 'triangle-exclamation';
								banner.title = this.translationService.getTranslation('_topBanner.newProject.unknownError.title');
								banner.text = this.translationService.getTranslation('_topBanner.newProject.unknownError.text', {
									projectName,
								});
								banner.progress = undefined;
								this.toastr.error(
									this.translationService.getTranslation('_toastr.newProject.unknownError.message', { projectName }),
									this.translationService.getTranslation('_toastr.newProject.unknownError.title'),
								);
								setTimeout(() => {
									this.topBannerService.removeBanner(banner);
								}, 1e4);
								resolve();
							}
						},
						(error) => {
							console.error('Error creating project:', error);
							banner.icon = 'triangle-exclamation';
							banner.title = this.translationService.getTranslation('_topBanner.newProject.unknownError.title');
							banner.text = this.translationService.getTranslation('_topBanner.newProject.unknownError.text', {
								projectName,
							});
							banner.progress = undefined;
							this.toastr.error(
								this.translationService.getTranslation('_toastr.newProject.unknownError.message', { projectName }),
								this.translationService.getTranslation('_toastr.newProject.unknownError.title'),
							);
							setTimeout(() => {
								this.topBannerService.removeBanner(banner);
							}, 1e4);
							resolve();
						},
					);
			} else resolve();
		});
	}

	close() {
		this.dialogRef.close();
	}
}
