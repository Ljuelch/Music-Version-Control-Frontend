import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { NewProjectVersionModal as NewProjectVersionModalInterface } from '../../interfaces/action/modal/newProjectVersionModal.interface';
import { FileUploadService } from '../../services/file-upload.service';
import { ProjectService } from '../../services/project.service';
import { TopBannerService } from '../../services/top-banner.service';
import { TranslationService } from '../../services/translation.service';

@Component({
	selector: 'app-new-project-version-modal',
	templateUrl: './new-project-version-modal.component.html',
})
export class NewProjectVersionModalComponent {
	@ViewChild('audioFileInput')
	private audioFileInput?: ElementRef<HTMLInputElement>;

	private get audioFile(): File | undefined {
		return this.audioFileInput?.nativeElement.files?.[0];
	}

	constructor(
		@Inject(MAT_DIALOG_DATA)
		protected data: NewProjectVersionModalInterface,
		private readonly toastr: ToastrService,
		private readonly dialogRef: MatDialogRef<NewProjectVersionModalComponent>,
		private readonly topBannerService: TopBannerService,
		private readonly translationService: TranslationService,
		private readonly fileUpload: FileUploadService,
		private readonly projectService: ProjectService,
	) {}

	protected submit() {
		const audioFile = this.audioFile;
		const banner = this.topBannerService.addBanner({
			icon: 'file-arrow-up',
			title: this.translationService.getTranslation('_topBanner.newProjectVersion.create.title'),
			text: this.translationService.getTranslation('_topBanner.newProjectVersion.create.text', {
				projectName: this.data.projectInfo.name,
			}),
			progress: audioFile ? null : undefined,
			onDoneData: {
				type: 'new-project-version',
				data: this.data.projectInfo.id,
			},
		});
		this.projectService.createProjectVersion(this.data.projectInfo.id, this.data.songBPM, this.data.songKey).subscribe(
			async (response) => {
				if (response.success && response.version) {
					this.data.versionNumber = response.version;
					await this.projectService.gotoProject(this.data.projectInfo.id, response.version);

					if (!this.data.versionNumber) {
						console.error(
							'Error creating project version:',
							'no audioFile or versionNumber',
							audioFile,
							this.data.versionNumber,
						);
						banner.icon = 'triangle-exclamation';
						banner.title = this.translationService.getTranslation('_topBanner.newProjectVersion.unknownError.title');
						banner.text = this.translationService.getTranslation('_topBanner.newProjectVersion.unknownError.text', {
							projectName: this.data.projectInfo.name,
						});
						banner.progress = undefined;
						this.toastr.error(
							this.translationService.getTranslation('_toastr.newProjectVersion.unknownError.message', {
								projectName: this.data.projectInfo.name,
							}),
							this.translationService.getTranslation('_toastr.newProjectVersion.unknownError.title'),
						);
						setTimeout(() => {
							this.topBannerService.removeBanner(banner);
						}, 1e4);
					} else if (!audioFile) {
						this.topBannerService.doneBanner(banner);
						this.topBannerService.removeBanner(banner);
						this.toastr.success(
							this.translationService.getTranslation('_toastr.newProjectVersion.success.message', {
								projectName: this.data.projectInfo.name,
								versionNumber: this.data.versionNumber?.toString(),
							}),
							this.translationService.getTranslation('_toastr.newProjectVersion.success.title'),
						);
					} else {
						console.log('Uploading Audio File:', audioFile.name);
						banner.title = this.translationService.getTranslation('_topBanner.newProjectVersion.fileUploading.title');
						banner.text = this.translationService.getTranslation('_topBanner.newProjectVersion.fileUploading.text', {
							fileName: audioFile.name,
							versionNumber: this.data.versionNumber.toString(),
							projectName: this.data.projectInfo.name,
						});
						banner.progress = 0;
						this.fileUpload.uploadAudioFile(this.data.projectInfo.id, this.data.versionNumber, audioFile).subscribe(
							(event) => {
								switch (event.type) {
									case HttpEventType.UploadProgress:
										const progress = event.loaded / event.total!;
										banner.progress = progress;

										if (progress >= 1) {
											banner.title = this.translationService.getTranslation(
												'_topBanner.newProjectVersion.preparing.title',
											);
											banner.text = this.translationService.getTranslation(
												'_topBanner.newProjectVersion.preparing.text',
												{
													projectName: this.data.projectInfo.name,
													versionNumber: this.data.versionNumber!.toString(),
												},
											);
											banner.progress = null;
										}
										break;

									case HttpEventType.Response:
										console.info('File uploaded:', response);
										this.topBannerService.doneBanner(banner);
										this.topBannerService.removeBanner(banner);
										this.toastr.success(
											this.translationService.getTranslation('_toastr.newProjectVersion.success.message', {
												projectName: this.data.projectInfo.name,
												versionNumber: this.data.versionNumber!.toString(),
											}),
											this.translationService.getTranslation('_toastr.newProjectVersion.success.title'),
										);
										break;
								}

								if (event.type === HttpEventType.Response) {
									console.info('File uploaded:', event.body);
								}
							},
							(error) => {
								console.error('Error uploading file:', error);
								banner.icon = 'triangle-exclamation';
								banner.title = this.translationService.getTranslation(
									'_topBanner.newProjectVersion.fileUploadError.title',
								);
								banner.text = this.translationService.getTranslation(
									'_topBanner.newProjectVersion.fileUploadError.text',
									{
										fileName: audioFile.name,
										versionNumber: this.data.versionNumber?.toString(),
										projectName: this.data.projectInfo.name,
									},
								);
								banner.progress = undefined;
								this.toastr.error(
									this.translationService.getTranslation('_toastr.newProjectVersion.fileUploadError.message', {
										fileName: audioFile.name,
										versionNumber: this.data.versionNumber!.toString(),
										projectName: this.data.projectInfo.name,
									}),
									this.translationService.getTranslation('_toastr.newProjectVersion.fileUploadError.title'),
								);
								setTimeout(() => {
									this.topBannerService.removeBanner(banner);
								}, 1e4);
							},
						);
					}
				} else {
					console.error('Error creating project version:', 'unsuccessfull createProjectVersion response', response);
					banner.icon = 'triangle-exclamation';
					banner.title = this.translationService.getTranslation('_topBanner.newProjectVersion.unknownError.title');
					banner.text = this.translationService.getTranslation('_topBanner.newProjectVersion.unknownError.text', {
						projectName: this.data.projectInfo.name,
					});
					banner.progress = undefined;
					this.toastr.error(
						this.translationService.getTranslation('_toastr.newProjectVersion.unknownError.message', {
							projectName: this.data.projectInfo.name,
						}),
						this.translationService.getTranslation('_toastr.newProjectVersion.unknownError.title'),
					);
					setTimeout(() => {
						this.topBannerService.removeBanner(banner);
					}, 1e4);
				}
			},
			(error) => {
				console.error('Error creating project version:', error);
				banner.icon = 'triangle-exclamation';
				banner.title = this.translationService.getTranslation('_topBanner.newProjectVersion.unknownError.title');
				banner.text = this.translationService.getTranslation('_topBanner.newProjectVersion.unknownError.text', {
					projectName: this.data.projectInfo.name,
				});
				banner.progress = undefined;
				this.toastr.error(
					this.translationService.getTranslation('_toastr.newProjectVersion.unknownError.message', {
						projectName: this.data.projectInfo.name,
					}),
					this.translationService.getTranslation('_toastr.newProjectVersion.unknownError.title'),
				);
				setTimeout(() => {
					this.topBannerService.removeBanner(banner);
				}, 1e4);
			},
		);

		this.close();
	}

	close() {
		this.dialogRef.close(true);
	}
}
