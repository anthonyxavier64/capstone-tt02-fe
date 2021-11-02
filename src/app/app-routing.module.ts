import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AccountActivationComponent } from './pages/admin/account-activation/account-activation/account-activation.component';
import { AdminComponent } from './pages/admin/adminLanding/admin.component';
import { AdminAnnouncementManagementComponent } from './pages/admin/announcementManagement/adminAnnouncementManagement.component';
import { AdminCompanyDetailsManagementComponent } from './pages/admin/companyDetails/companyDetailsManagement/adminCompanyDetailsManagement.component';
import { OfficeSpaceConfigComponent } from './pages/admin/companyDetails/office-space-config/office-space-config.component';
import { AdminEmployeeManagementComponent } from './pages/admin/employeeManagement/adminEmployeeManagement.component';
import { AdminWfoManagementComponent } from './pages/admin/wfoManagement/adminWfoManagement.component';
import { AlternateWorkTeamsConfigComponent } from './pages/admin/wfoManagement/alternateWorkTeamsConfig/alternateWorkTeamsConfig.component';
import { OfficeQuotaConfigComponent } from './pages/admin/wfoManagement/officeQuotaConfig/officeQuotaConfig.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { CovidDeclarationsComponent } from './pages/covid-declarations/covid-declarations.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GoalsComponent } from './pages/employee/goals/goals.component';
import { CreateNewMeetingComponent } from './pages/employee/meeting/create-new-meeting/create-new-meeting.component';
import { UpdateMeetingComponent } from './pages/employee/meeting/update-meeting/update-meeting.component';
import { TaskComponent } from './pages/employee/task/task.component';
import { IndexComponent } from './pages/index/index.component';
import { LoginComponent } from './pages/index/login/login.component';
import { SignUpComponent } from './pages/index/sign-up/sign-up.component';
import { ProfileComponent } from './pages/profile/profile.component';

const user = JSON.parse(localStorage.getItem('currentUser'));

let landingRoute;

if (user) {
  landingRoute = '/dashboard';
} else {
  landingRoute = '/index';
}

const routes: Routes = [
  { path: '', redirectTo: landingRoute, pathMatch: 'full' },
  { path: 'index', component: IndexComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signUp', component: SignUpComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'adminCompanyDetailsManagement',
    component: AdminCompanyDetailsManagementComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'officeSpaceConfig',
    component: OfficeSpaceConfigComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'adminEmployeeManagement',
    component: AdminEmployeeManagementComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'adminWfoManagement',
    component: AdminWfoManagementComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'officeQuotaConfig',
    component: OfficeQuotaConfigComponent,
  },
  {
    path: 'alternateWorkTeamsConfig',
    component: AlternateWorkTeamsConfigComponent,
  },
  {
    path: 'adminAnnouncementManagement',
    component: AdminAnnouncementManagementComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: 'goals', component: GoalsComponent, canActivate: [AuthGuard] },
  {
    path: 'task',
    component: TaskComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'task/:goalId',
    component: TaskComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'covid-declarations',
    component: CovidDeclarationsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create-meeting',
    component: CreateNewMeetingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'update-meeting/:meetingId',
    component: UpdateMeetingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'account-activation',
    component: AccountActivationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
