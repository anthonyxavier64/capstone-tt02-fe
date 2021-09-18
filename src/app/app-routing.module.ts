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
import { IndexComponent } from './pages/index/index.component';
import { LoginComponent } from './pages/index/login/login.component';
import { SignUpComponent } from './pages/index/sign-up/sign-up.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: 'index', component: IndexComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  {
    path: 'adminCompanyDetailsManagement',
    component: AdminCompanyDetailsManagementComponent,
  },
  {
    path: 'officeSpaceConfig',
    component: OfficeSpaceConfigComponent,
  },
  {
    path: 'adminEmployeeManagement',
    component: AdminEmployeeManagementComponent,
  },
  {
    path: 'adminWfoManagement',
    component: AdminWfoManagementComponent,
  },
  {
    path: 'adminAnnouncementManagement',
    component: AdminAnnouncementManagementComponent,
  },
  {
    path: 'adminAnnouncementManagement/edit/:announcementId',
    component: EditAnnouncementComponent,
  },
  { path: 'profile', component: ProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
