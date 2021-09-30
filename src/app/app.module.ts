import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TOKEN_KEY } from './config';
import { MaterialModule } from './core/material.module';
import { PrimeNgModule } from './core/primeng.module';
import { NgCircleProgressModule } from 'ng-circle-progress';

import { AdminComponent } from './pages/admin/adminLanding/admin.component';
import { AdminAnnouncementManagementComponent } from './pages/admin/announcementManagement/adminAnnouncementManagement.component';
import { AdminCompanyDetailsManagementComponent } from './pages/admin/companyDetails/companyDetailsManagement/adminCompanyDetailsManagement.component';
import { OfficeSpaceConfigComponent } from './pages/admin/companyDetails/office-space-config/office-space-config.component';
import { DeleteAnnouncementComponent } from './pages/admin/delete-announcement/delete-announcement.component';
import { DepartmentInChargeOfComponent } from './pages/admin/dialogs/department-in-charge-of/department-in-charge-of.component';
import { DepartmentPartOfComponent } from './pages/admin/dialogs/department-part-of/department-part-of.component';
import { NewDepartmentComponent } from './pages/admin/dialogs/new-department/new-department.component';
import { EditAnnouncementComponent } from './pages/admin/edit-announcement/edit-announcement.component';
import { AdminEmployeeManagementComponent } from './pages/admin/employeeManagement/adminEmployeeManagement.component';
import { DeleteEmployeeDialogComponent } from './pages/admin/employeeManagement/delete-employee-dialog/delete-employee-dialog.component';
import { EditEmployeeDialogComponent } from './pages/admin/employeeManagement/edit-employee-dialog/edit-employee-dialog.component';
import { AdminWfoManagementComponent } from './pages/admin/wfoManagement/adminWfoManagement.component';
import { IndexComponent } from './pages/index/index.component';
import { LoginComponent } from './pages/index/login/login.component';
import { CompanyDetailsDialogComponent } from './pages/index/sign-up/company-details-dialog/company-details-dialog.component';
import { SignUpComponent } from './pages/index/sign-up/sign-up.component';
import { TierInfoDialogComponent } from './pages/index/sign-up/tier-info-dialog/tier-info-dialog.component';
import { ChangePasswordComponent } from './pages/profile/change-password/change-password.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ViewAnnouncementComponent } from './pages/view-announcement/view-announcement.component';
import { NavbarComponent } from './sharedComponents/navbar/navbar.component';
import { AdminGuideComponent } from './pages/admin/adminLanding/admin-guide/admin-guide.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

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
    OfficeSpaceConfigComponent,
    AdminEmployeeManagementComponent,
    AdminWfoManagementComponent,
    AdminAnnouncementManagementComponent,
    ProfileComponent,
    EditAnnouncementComponent,
    DeleteAnnouncementComponent,
    ViewAnnouncementComponent,
    SignUpComponent,
    TierInfoDialogComponent,
    ChangePasswordComponent,
    CompanyDetailsDialogComponent,
    NewDepartmentComponent,
    DepartmentInChargeOfComponent,
    DepartmentPartOfComponent,
    AdminEmployeeManagementComponent,
    LoginComponent,
    SignUpComponent,
    ProfileComponent,
    EditEmployeeDialogComponent,
    DeleteEmployeeDialogComponent,
    AdminGuideComponent,
    DashboardComponent,
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
    MatFormFieldModule,
    MatCheckboxModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    PrimeNgModule,
    TableModule,
    InputTextareaModule,
    InputTextModule,
    DialogModule,
    StyleClassModule,
    DataViewModule,
    DropdownModule,
    NgCircleProgressModule.forRoot({
      radius: 80,
      innerStrokeWidth: 10,
      outerStrokeWidth: 10,
      space: -10,
      innerStrokeColor: "rgb(var(--primary-button-color)",
      outerStrokeColor: "rgb(var(--covid-button-color)",
      animation: true,
      animationDuration: 300,
      titleFontSize: "1.8rem",
      titleColor: "rgb(var(--theme-primary-color)",
      unitsFontSize: "1.8rem",
      unitsColor: "rgb(var(--theme-primary-color)",
      subtitleFontSize: "1.5rem",
      subtitleColor: "rgba(var(--theme-primary-color)",
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:3000'],
      },
    }),
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {},
    },
    DialogService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
