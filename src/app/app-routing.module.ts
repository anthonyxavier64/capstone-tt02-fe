import { RouterModule, Routes } from '@angular/router';

import { AdminAnnouncementManagementComponent } from './pages/admin/announcementManagement/adminAnnouncementManagement.component';
import { AdminCompanyDetailsManagementComponent } from './pages/admin/companyDetailsManagement/adminCompanyDetailsManagement.component';
import { AdminComponent } from './pages/admin/adminLanding/admin.component';
import { AdminEmployeeManagementComponent } from './pages/admin/employeeManagement/adminEmployeeManagement.component';
import { AdminWfoManagementComponent } from './pages/admin/wfoManagement/adminWfoManagement.component';
import { AuthGuard } from './guards/auth.guard';
import { IndexComponent } from './pages/index/index.component';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './pages/profile/profile.component';
import { SignUpComponent } from './pages/index/sign-up/sign-up.component';

const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: 'index', component: IndexComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
  },
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
export class AppRoutingModule {}
