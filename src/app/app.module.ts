import * as moment from 'moment';

import {
  CalendarDateFormatter,
  CalendarModule,
  CalendarMomentDateFormatter,
  DateAdapter,
  MOMENT,
} from 'angular-calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { AccountActivationComponent } from './pages/admin/account-activation/account-activation/account-activation.component';
import { AdminAnnouncementManagementComponent } from './pages/admin/announcementManagement/adminAnnouncementManagement.component';
import { AdminCompanyDetailsManagementComponent } from './pages/admin/companyDetails/companyDetailsManagement/adminCompanyDetailsManagement.component';
import { AdminComponent } from './pages/admin/adminLanding/admin.component';
import { AdminEmployeeManagementComponent } from './pages/admin/employeeManagement/adminEmployeeManagement.component';
import { AdminGuideComponent } from './pages/admin/adminLanding/admin-guide/admin-guide.component';
import { AdminWfoManagementComponent } from './pages/admin/wfoManagement/adminWfoManagement.component';
import { AlternateWorkTeamsConfigComponent } from './pages/admin/wfoManagement/alternateWorkTeamsConfig/alternateWorkTeamsConfig.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ArtDialogComponent } from './pages/covid-declarations/art-test-results-dialog/art-test-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { ChangePasswordComponent } from './pages/profile/change-password/change-password.component';
import { ColorSelectorDialogComponent } from './pages/employee/meeting/create-new-meeting/color-selector-dialog/color-selector-dialog.component';
import { CommonModule } from '@angular/common';
import { CompanyDetailsDialogComponent } from './pages/index/sign-up/company-details-dialog/company-details-dialog.component';
import { CovidDeclarationsComponent } from './pages/covid-declarations/covid-declarations.component';
import { CreateNewMeetingComponent } from './pages/employee/meeting/create-new-meeting/create-new-meeting.component';
import { CreateNewTaskDialogComponent } from './pages/employee/create-new-task-dialog/create-new-task-dialog.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DataViewModule } from 'primeng/dataview';
import { DeleteAnnouncementComponent } from './pages/admin/delete-announcement/delete-announcement.component';
import { DeleteEmployeeDialogComponent } from './pages/admin/employeeManagement/delete-employee-dialog/delete-employee-dialog.component';
import { DeleteMeetingDialogComponent } from './pages/employee/meeting/delete-meeting-dialog/delete-meeting-dialog.component';
import { DepartmentInChargeOfComponent } from './pages/admin/dialogs/department-in-charge-of/department-in-charge-of.component';
import { DepartmentPartOfComponent } from './pages/admin/dialogs/department-part-of/department-part-of.component';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { DownloadCsvDialogComponent } from './pages/admin/employeeManagement/download-csv-dialog/download-csv-dialog.component';
import { DropdownModule } from 'primeng/dropdown';
import { EditAnnouncementComponent } from './pages/admin/edit-announcement/edit-announcement.component';
import { EditEmployeeDialogComponent } from './pages/admin/employeeManagement/edit-employee-dialog/edit-employee-dialog.component';
import { EditExceptionDialogComponent } from './pages/admin/wfoManagement/officeQuotaConfig/edit-exception-dialog/edit-exception-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { IndexComponent } from './pages/index/index.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { JwtModule } from '@auth0/angular-jwt';
import { LoginComponent } from './pages/index/login/login.component';
import { MassInviteInfoDialogComponent } from './pages/admin/employeeManagement/mass-invite-info-dialog/mass-invite-info-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MaterialModule } from './core/material.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { NavbarComponent } from './sharedComponents/navbar/navbar.component';
import { NewDepartmentComponent } from './pages/admin/dialogs/new-department/new-department.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgModule } from '@angular/core';
import { OfficeQuotaConfigComponent } from './pages/admin/wfoManagement/officeQuotaConfig/officeQuotaConfig.component';
import { OfficeSpaceConfigComponent } from './pages/admin/companyDetails/office-space-config/office-space-config.component';
import { PrimeNgModule } from './core/primeng.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { ShnDeclarationDialogComponent } from './pages/covid-declarations/shn-declaration-dialog/shn-declaration-dialog.component';
import { SignUpComponent } from './pages/index/sign-up/sign-up.component';
import { StyleClassModule } from 'primeng/styleclass';
import { TOKEN_KEY } from './config';
import { TableModule } from 'primeng/table';
import { TaskComponent } from './pages/employee/task/task.component';
import { TaskDetailDialogComponent } from './pages/employee/task-detail-dialog/task-detail-dialog.component';
import { TierInfoDialogComponent } from './pages/index/sign-up/tier-info-dialog/tier-info-dialog.component';
import { UpdateMeetingComponent } from './pages/employee/meeting/update-meeting/update-meeting.component';
import { UploadVaccinationDialogComponent } from './pages/covid-declarations/upload-vaccination-dialog/upload-vaccination-dialog.component';
import { ViewAnnouncementComponent } from './pages/view-announcement/view-announcement.component';
import { ViewArtComponent } from './pages/admin/employeeManagement/view-art-dialog/view-art-dialog.component';
import { ViewMeetingDetailsDialogComponent } from './pages/calendar/view-meeting-details-dialog/view-meeting-details-dialog.component';
import { ViewShnDeclarationDialog } from './pages/admin/employeeManagement/view-shn-dialog/view-shn-dialog.component';
import { ViewVaccinationDialogComponent } from './pages/admin/employeeManagement/view-vaccination-dialog/view-vaccination-dialog.component';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import { environment } from 'src/environments/environment.dev';
import { EditRoomDetailsDialogComponent } from './pages/admin/companyDetails/office-space-config/edit-room-details-dialog/edit-room-details-dialog.component';
import { AddRoomDialogComponent } from './pages/admin/companyDetails/office-space-config/add-room-dialog/add-room-dialog.component';
import { EditOfficeDetailsDialogComponent } from './pages/admin/companyDetails/office-space-config/edit-office-details-dialog/edit-office-details-dialog.component';

export function momentAdapterFactory() {
  return adapterFactory(moment);
}

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
    UploadVaccinationDialogComponent,
    CalendarComponent,
    DownloadCsvDialogComponent,
    MassInviteInfoDialogComponent,
    CreateNewMeetingComponent,
    ColorSelectorDialogComponent,
    AccountActivationComponent,
    ViewMeetingDetailsDialogComponent,
    DeleteMeetingDialogComponent,
    UpdateMeetingComponent,
    EditRoomDetailsDialogComponent,
    AddRoomDialogComponent,
    EditOfficeDetailsDialogComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatIconModule,
    MatNativeDateModule,
    MatMenuModule,
    MatCardModule,
    MatBadgeModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    PrimeNgModule,
    TableModule,
    InputTextareaModule,
    InputTextModule,
    DialogModule,
    StyleClassModule,
    DataViewModule,
    DropdownModule,
    MultiSelectModule,
    NgCircleProgressModule.forRoot({
      radius: 80,
      innerStrokeWidth: 10,
      outerStrokeWidth: 10,
      space: -10,
      innerStrokeColor: 'rgb(var(--primary-button-color)',
      outerStrokeColor: 'rgb(var(--covid-button-color)',
      animation: true,
      animationDuration: 300,
      titleFontSize: '1.8rem',
      titleColor: 'rgb(var(--theme-primary-color)',
      unitsFontSize: '1.8rem',
      unitsColor: 'rgb(var(--theme-primary-color)',
      subtitleFontSize: '1.5rem',
      subtitleColor: 'rgba(var(--theme-primary-color)',
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:3000'],
      },
    }),
    CalendarModule.forRoot(
      {
        provide: DateAdapter,
        useFactory: momentAdapterFactory,
      },
      {
        dateFormatter: {
          provide: CalendarDateFormatter,
          useClass: CalendarMomentDateFormatter,
        },
      }
    ),
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
    {
      provide: MOMENT,
      useValue: moment,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
