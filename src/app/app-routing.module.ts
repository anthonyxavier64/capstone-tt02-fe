import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminComponent } from './pages/admin/adminLanding/admin.component';
import { AdminAnnouncementManagementComponent } from './pages/admin/announcementManagement/adminAnnouncementManagement.component';
import { AdminCompanyDetailsManagementComponent } from './pages/admin/companyDetails/companyDetailsManagement/adminCompanyDetailsManagement.component';
<<<<<<< HEAD
import { OfficeSpaceConfigComponent } from './pages/admin/companyDetails/office-space-config/office-space-config.component';
=======
>>>>>>> a9f5716 (feat: retrieve company details, wip)
import { AdminEmployeeManagementComponent } from './pages/admin/employeeManagement/adminEmployeeManagement.component';
import { AdminWfoManagementComponent } from './pages/admin/wfoManagement/adminWfoManagement.component';
import { IndexComponent } from './pages/index/index.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: 'index', component: IndexComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard]
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
  { path: 'profile', component: ProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
