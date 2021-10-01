import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminComponent } from './pages/admin/adminLanding/admin.component';
import { AdminAnnouncementManagementComponent } from './pages/admin/announcementManagement/adminAnnouncementManagement.component';
import { AdminCompanyDetailsManagementComponent } from './pages/admin/companyDetails/companyDetailsManagement/adminCompanyDetailsManagement.component';
import { OfficeSpaceConfigComponent } from './pages/admin/companyDetails/office-space-config/office-space-config.component';
import { EditAnnouncementComponent } from './pages/admin/edit-announcement/edit-announcement.component';
import { AdminEmployeeManagementComponent } from './pages/admin/employeeManagement/adminEmployeeManagement.component';
import { AdminWfoManagementComponent } from './pages/admin/wfoManagement/adminWfoManagement.component';
import { AlternateWorkTeamsConfigComponent } from './pages/admin/wfoManagement/alternateWorkTeamsConfig/alternateWorkTeamsConfig.component';
import { OfficeQuotaConfigComponent } from './pages/admin/wfoManagement/officeQuotaConfig/officeQuotaConfig.component';
import { IndexComponent } from './pages/index/index.component';
import { LoginComponent } from './pages/index/login/login.component';
import { SignUpComponent } from './pages/index/sign-up/sign-up.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TaskComponent } from './pages/employee/task/task.component';

const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full' },
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
    path: 'task',
    component: TaskComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
