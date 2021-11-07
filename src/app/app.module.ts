import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import {
  MatFormFieldModule,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import {
  CalendarDateFormatter,
  CalendarModule,
  CalendarMomentDateFormatter,
  DateAdapter,
  MOMENT,
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { environment } from 'src/environments/environment.dev';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TOKEN_KEY } from './config';
import { MaterialModule } from './core/material.module';
import { PrimeNgModule } from './core/primeng.module';
import { AccountActivationComponent } from './pages/admin/account-activation/account-activation.component';
import { AdminGuideComponent } from './pages/admin/admin-landing/admin-guide/admin-guide.component';
import { AdminComponent } from './pages/admin/admin-landing/admin.component';
import { AdminAnnouncementManagementComponent } from './pages/admin/announcement-management/admin-announcement-management.component';
import { DeleteAnnouncementComponent } from './pages/admin/announcement-management/delete-announcement/delete-announcement.component';
import { EditAnnouncementComponent } from './pages/admin/announcement-management/edit-announcement/edit-announcement.component';
import { ViewAnnouncementComponent } from './pages/admin/announcement-management/view-announcement/view-announcement.component';
import { AdminCompanyDetailsManagementComponent } from './pages/admin/company-details/company-details-management/admin-company-details-management.component';
import { AddRoomDialogComponent } from './pages/admin/company-details/office-space-config/add-room-dialog/add-room-dialog.component';
import { EditOfficeDetailsDialogComponent } from './pages/admin/company-details/office-space-config/edit-office-details-dialog/edit-office-details-dialog.component';
import { EditRoomDetailsDialogComponent } from './pages/admin/company-details/office-space-config/edit-room-details-dialog/edit-room-details-dialog.component';
import { OfficeSpaceConfigComponent } from './pages/admin/company-details/office-space-config/office-space-config.component';
import { AdminEmployeeManagementComponent } from './pages/admin/employee-management/admin-employee-management.component';
import { DeleteEmployeeDialogComponent } from './pages/admin/employee-management/delete-employee-dialog/delete-employee-dialog.component';
import { DepartmentInChargeOfComponent } from './pages/admin/employee-management/department-in-charge-of/department-in-charge-of.component';
import { DepartmentPartOfComponent } from './pages/admin/employee-management/department-part-of/department-part-of.component';
import { DownloadCsvDialogComponent } from './pages/admin/employee-management/download-csv-dialog/download-csv-dialog.component';
import { EditEmployeeDialogComponent } from './pages/admin/employee-management/edit-employee-dialog/edit-employee-dialog.component';
import { MassInviteInfoDialogComponent } from './pages/admin/employee-management/mass-invite-info-dialog/mass-invite-info-dialog.component';
import { NewDepartmentComponent } from './pages/admin/employee-management/new-department/new-department.component';
import { ViewArtComponent } from './pages/admin/employee-management/view-art-dialog/view-art-dialog.component';
import { ViewShnDeclarationDialog } from './pages/admin/employee-management/view-shn-dialog/view-shn-dialog.component';
import { ViewVaccinationDialogComponent } from './pages/admin/employee-management/view-vaccination-dialog/view-vaccination-dialog.component';
import { AdminWfoManagementComponent } from './pages/admin/wfo-management/admin-wfo-management.component';
import { AlternateWorkTeamsConfigComponent } from './pages/admin/wfo-management/alternate-work-teams-config/alternate-work-teams-config.component';
import { EditExceptionDialogComponent } from './pages/admin/wfo-management/office-quota-config/edit-exception-dialog/edit-exception-dialog.component';
import { OfficeQuotaConfigComponent } from './pages/admin/wfo-management/office-quota-config/office-quota-config.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { DayComponent } from './pages/calendar/day/day.component';
import { ViewMeetingDetailsDialogComponent } from './pages/calendar/view-meeting-details-dialog/view-meeting-details-dialog.component';
import { ArtDialogComponent } from './pages/covid-declarations/art-test-results-dialog/art-test-dialog.component';
import { CovidDeclarationsComponent } from './pages/covid-declarations/covid-declarations.component';
import { ShnDeclarationDialogComponent } from './pages/covid-declarations/shn-declaration-dialog/shn-declaration-dialog.component';
import { UploadVaccinationDialogComponent } from './pages/covid-declarations/upload-vaccination-dialog/upload-vaccination-dialog.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CreateNewGoalDialogComponent } from './pages/employee/goals/create-new-goal-dialog/create-new-goal-dialog.component';
import { CreateNewTaskDialogComponent } from './pages/employee/goals/create-new-task-dialog/create-new-task-dialog.component';
import { EditGoalDialogComponent } from './pages/employee/goals/edit-goal-dialog/edit-goal-dialog.component';
import { GoalsComponent } from './pages/employee/goals/goals.component';
import { ColorSelectorDialogComponent } from './pages/employee/meeting/create-new-meeting/color-selector-dialog/color-selector-dialog.component';
import { CreateNewMeetingComponent } from './pages/employee/meeting/create-new-meeting/create-new-meeting.component';
import { DeleteMeetingDialogComponent } from './pages/employee/meeting/delete-meeting-dialog/delete-meeting-dialog.component';
import { UpdateMeetingComponent } from './pages/employee/meeting/update-meeting/update-meeting.component';
import { TaskDetailDialogComponent } from './pages/employee/task/task-detail-dialog/task-detail-dialog.component';
import { TaskComponent } from './pages/employee/task/task.component';
import { IndexComponent } from './pages/index/index.component';
import { ForgotPasswordDialogComponent } from './pages/index/login/forgot-password-dialog/forgot-password-dialog.component';
import { LoginComponent } from './pages/index/login/login.component';
import { CompanyDetailsDialogComponent } from './pages/index/sign-up/company-details-dialog/company-details-dialog.component';
import { SignUpComponent } from './pages/index/sign-up/sign-up.component';
import { TierInfoDialogComponent } from './pages/index/sign-up/tier-info-dialog/tier-info-dialog.component';
import { ChangePasswordComponent } from './pages/profile/change-password/change-password.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NavbarComponent } from './shared-components/navbar/navbar.component';

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
    DayComponent,
    GoalsComponent,
    EditGoalDialogComponent,
    CreateNewGoalDialogComponent,
    ForgotPasswordDialogComponent,
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
    MatDividerModule,
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
