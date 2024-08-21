import { NgOptimizedImage } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxColorsModule } from 'ngx-colors';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BodyComponent } from './components/body/body.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { ProjectComponent } from './components/project/project.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { StartpageComponent } from './components/startpage/startpage.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { AllProjectsTableComponent } from './lib/all-projects-table/all-projects-table.component';
import { AvatarComponent } from './lib/avatar/avatar.component';
import { BadgeComponent } from './lib/badge/badge.component';
import { DashboardBodyComponent } from './lib/dashboard-body/dashboard-body.component';
import { DashboardHeaderSelfComponent } from './lib/dashboard-header/dashboard-header-self/dashboard-header-self.component';
import { DashboardHeaderUserComponent } from './lib/dashboard-header/dashboard-header-user/dashboard-header-user.component';
import { DashboardHeaderComponent } from './lib/dashboard-header/dashboard-header.component';
import { GlobalAudioPlayerComponent } from './lib/global-audio-player/global-audio-player.component';
import { SeekbarComponent } from './lib/global-audio-player/seekbar/seekbar.component';
import { GlobalAudioPlayerSpaceComponent } from './lib/global-audio-player/space/global-audio-player-space.component';
import { ImageCropperComponent } from './lib/image-cropper/image-cropper.component';
import { MarkerChipListComponent } from './lib/marker-chip/marker-chip-list/marker-chip-list.component';
import { MarkerChipComponent } from './lib/marker-chip/marker-chip.component';
import { NavBarDropdownComponent } from './lib/nav-bar/nav-bar-dropdown/nav-bar-dropdown.component';
import { NotificationDropdownContentComponent } from './lib/nav-bar/nav-bar-dropdown/notification-dropdown-content/notification-dropdown-content.component';
import { UserDropdownContentComponent } from './lib/nav-bar/nav-bar-dropdown/user-dropdown-content/user-dropdown-content.component';
import { NavBarComponent } from './lib/nav-bar/nav-bar.component';
import { NewProjectModalComponent } from './lib/new-project-modal/new-project-modal.component';
import { NewProjectVersionModalComponent } from './lib/new-project-version-modal/new-project-version-modal.component';
import { ProjectContributorsTableComponent } from './lib/project-contributors-table/project-contributors-table.component';
import { ProjectStemsTableComponent } from './lib/project-stems-table/project-stems-table.component';
import { AccountSettingsComponent } from './lib/settings/account-settings/account-settings.component';
import { InfoTabComponent } from './lib/settings/info-tab/info-tab.component';
import { NotificationSettingsComponent } from './lib/settings/notification-settings/notification-settings.component';
import { SecuritySettingsComponent } from './lib/settings/security-settings/security-settings.component';
import { SongCardSliderComponent } from './lib/song-card/song-card-slider/song-card-slider.component';
import { SongCardComponent } from './lib/song-card/song-card.component';
import { TopBannerComponent } from './lib/top-banner-list/top-banner/top-banner.component';
import { TopBannerListComponent } from './lib/top-banner-list/top-banner-list.component';
import { UserSearchComponent } from './lib/user-search-modal/user-search/user-search.component';
import { UserSearchModalComponent } from './lib/user-search-modal/user-search-modal.component';
import { VersionChangesTableComponent } from './lib/version-changes-table/version-changes-table.component';
import { VersionChecklistComponent } from './lib/version-checklist/version-checklist.component';
import { VersionTimelineComponent } from './lib/version-timeline/version-timeline.component';
import { WaveformPlayerControlsLargeComponent } from './lib/waveform-player/waveform-player-controls-large/waveform-player-controls-large.component';
import { WaveformPlayerControlsSmallComponent } from './lib/waveform-player/waveform-player-controls-small/waveform-player-controls-small.component';
import { WaveformPlayerComponent } from './lib/waveform-player/waveform-player.component';
import { ApiInterceptor } from './middleware/api.interceptor';
import { TranslatePipe } from './pipes/translate.pipe';
import { TranslationService } from './services/translation.service';

function initializeApp(translationService: TranslationService) {
	return async () => await translationService.loadTranslations();
}

@NgModule({
	bootstrap: [AppComponent],
	declarations: [
		AppComponent,
		TranslatePipe,
		NavBarComponent,
		LoginComponent,
		BodyComponent,
		DashboardComponent,
		RegisterComponent,
		SongCardComponent,
		NewProjectModalComponent,
		AllProjectsTableComponent,
		WaveformPlayerComponent,
		ProjectComponent,
		WaveformPlayerControlsSmallComponent,
		VersionTimelineComponent,
		WaveformPlayerControlsLargeComponent,
		NotificationDropdownContentComponent,
		BadgeComponent,
		NavBarDropdownComponent,
		UserDropdownContentComponent,
		SongCardSliderComponent,
		ResetPasswordComponent,
		StartpageComponent,
		VersionChecklistComponent,
		ProjectContributorsTableComponent,
		VersionChangesTableComponent,
		UserSearchComponent,
		UserSearchModalComponent,
		DashboardHeaderComponent,
		DashboardHeaderSelfComponent,
		NewProjectVersionModalComponent,
		UserDashboardComponent,
		DashboardHeaderUserComponent,
		TopBannerComponent,
		TopBannerListComponent,
		UserSettingsComponent,
		AccountSettingsComponent,
		SecuritySettingsComponent,
		NotificationSettingsComponent,
		InfoTabComponent,
		AvatarComponent,
		ImageCropperComponent,
		FooterComponent,
		ProjectStemsTableComponent,
		GlobalAudioPlayerComponent,
		GlobalAudioPlayerSpaceComponent,
		SeekbarComponent,
		MarkerChipComponent,
		MarkerChipListComponent,
		DashboardBodyComponent,
	],
	imports: [
		NgbModule,
		NgbDropdownModule,
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatButtonModule,
		MatInputModule,
		HttpClientModule,
		FormsModule,
		NgxColorsModule,
		ToastrModule.forRoot(),
		MatDialogModule,
		NgOptimizedImage,
		MatButtonToggleModule,
		MatTooltipModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatProgressBarModule,
		MatIconModule,
		ReactiveFormsModule,
		MatMenuModule,
	],
	providers: [
		TranslationService,
		{
			provide: APP_INITIALIZER,
			useFactory: initializeApp,
			multi: true,
			deps: [TranslationService],
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: ApiInterceptor,
			multi: true,
		},
	],
})
export class AppModule {}
