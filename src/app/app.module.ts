import { NgCircleProgressModule } from 'ng-circle-progress';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { environment } from 'src/environments/environment.dev';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TOKEN_KEY } from './config';
import { MaterialModule } from './core/material.module';
import { PrimeNgModule } from './core/primeng.module';
import { AdminGuideComponent } from './pages/admin/adminLanding/admin-guide/admin-guide.component';
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
import { ViewArtComponent } from './pages/admin/employeeManagement/view-art-dialog/view-art-dialog.component';
import { ViewShnDeclarationDialog } from './pages/admin/employeeManagement/view-shn-dialog/view-shn-dialog.component';
import { ViewVaccinationDialogComponent } from './pages/admin/employeeManagement/view-vaccination-dialog/view-vaccination-dialog.component';
import { AdminWfoManagementComponent } from './pages/admin/wfoManagement/adminWfoManagement.component';
import { AlternateWorkTeamsConfigComponent } from './pages/admin/wfoManagement/alternateWorkTeamsConfig/alternateWorkTeamsConfig.component';
import { EditExceptionDialogComponent } from './pages/admin/wfoManagement/officeQuotaConfig/edit-exception-dialog/edit-exception-dialog.component';
import { OfficeQuotaConfigComponent } from './pages/admin/wfoManagement/officeQuotaConfig/officeQuotaConfig.component';
import { ArtDialogComponent } from './pages/covid-declarations/art-test-results-dialog/art-test-dialog.component';
import { CovidDeclarationsComponent } from './pages/covid-declarations/covid-declarations.component';
import { ShnDeclarationDialogComponent } from './pages/covid-declarations/shn-declaration-dialog/shn-declaration-dialog.component';
import { UploadVaccinationDialogComponent } from './pages/covid-declarations/upload-vaccination-dialog/upload-vaccination-dialog.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CreateNewTaskDialogComponent } from './pages/employee/create-new-task-dialog/create-new-task-dialog.component';
import { TaskDetailDialogComponent } from './pages/employee/task-detail-dialog/task-detail-dialog.component';
import { TaskComponent } from './pages/employee/task/task.component';
import { IndexComponent } from './pages/index/index.component';
import { LoginComponent } from './pages/index/login/login.component';
import { CompanyDetailsDialogComponent } from './pages/index/sign-up/company-details-dialog/company-details-dialog.component';
import { SignUpComponent } from './pages/index/sign-up/sign-up.component';
import { TierInfoDialogComponent } from './pages/index/sign-up/tier-info-dialog/tier-info-dialog.component';
import { ChangePasswordComponent } from './pages/profile/change-password/change-password.component';
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
    OfficeSpaceConfigComponent,
    AdminEmployeeManagementComponent,
    AdminWfoManagementComponent,
    OfficeQuotaConfigComponent,
    AlternateWorkTeamsConfigComponent,
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
    EditExceptionDialogComponent,
    TaskComponent,
    TaskDetailDialogComponent,
    CreateNewTaskDialogComponent,
    CovidDeclarationsComponent,
    ShnDeclarationDialogComponent,
    ArtDialogComponent,
    ViewVaccinationDialogComponent,
    ViewShnDeclarationDialog,
    ViewArtComponent,
    UploadVaccinationDialogComponent],
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
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
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
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    DialogService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
