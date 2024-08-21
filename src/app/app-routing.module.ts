import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { ProjectComponent } from './components/project/project.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { StartpageComponent } from './components/startpage/startpage.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';

const routes: Routes = [
	{ path: '', component: StartpageComponent },
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'reset-password', component: ResetPasswordComponent },
	{ path: 'user/:user_id', component: UserDashboardComponent },
	{ path: 'project/:project_id', component: ProjectComponent },
	{ path: 'project/:project_id/v/:versionNumber', component: ProjectComponent },
	{ path: 'user-settings', component: UserSettingsComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
