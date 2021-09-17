import { DropdownModule } from 'primeng/dropdown';

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TOKEN_KEY } from './config';
import { MaterialModule } from './core/material.module';
import { PrimeNgModule } from './core/primeng.module';
import { AdminComponent } from './pages/admin/adminLanding/admin.component';
import { AdminAnnouncementManagementComponent } from './pages/admin/announcementManagement/adminAnnouncementManagement.component';
import { AdminCompanyDetailsManagementComponent } from './pages/admin/companyDetailsManagement/adminCompanyDetailsManagement.component';
import { DeleteAnnouncementComponent } from './pages/admin/delete-announcement/delete-announcement.component';
import { DepartmentInChargeOfComponent } from './pages/admin/department-in-charge-of/department-in-charge-of.component';
import { DepartmentPartOfComponent } from './pages/admin/department-part-of/department-part-of.component';
import { EditAnnouncementComponent } from './pages/admin/edit-announcement/edit-announcement.component';
import { AdminEmployeeManagementComponent } from './pages/admin/employeeManagement/adminEmployeeManagement.component';
import { UploadEmployeeCSVComponent } from './pages/admin/upload-employee-csv/upload-employee-csv.component';
import { AdminWfoManagementComponent } from './pages/admin/wfoManagement/adminWfoManagement.component';
import { IndexComponent } from './pages/index/index.component';
import { LoginComponent } from './pages/index/login/login.component';
import { SignUpComponent } from './pages/index/sign-up/sign-up.component';
import { TierInfoDialogComponent } from './pages/index/sign-up/tier-info-dialog/tier-info-dialog.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ViewAnnouncementComponent } from './pages/view-announcement/view-announcement.component';
import { NavbarComponent } from './sharedComponents/navbar/navbar.component';

export function tokenGetter() {
  return localStorage.getItem(TOKEN_KEY);
}
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    IndexComponent,
    LoginComponent,
    AdminComponent,
    AdminCompanyDetailsManagementComponent,
    AdminEmployeeManagementComponent,
    AdminWfoManagementComponent,
    AdminAnnouncementManagementComponent,
    ProfileComponent,
    EditAnnouncementComponent,
    DeleteAnnouncementComponent,
    ViewAnnouncementComponent,
    SignUpComponent,
    TierInfoDialogComponent,
    DepartmentInChargeOfComponent,
    DepartmentPartOfComponent,
    UploadEmployeeCSVComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
    MatDialogModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
    MatTableModule,
    PrimeNgModule,
    DropdownModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:3000'],
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
