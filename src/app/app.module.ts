import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminAnnouncementManagementComponent } from './pages/admin/announcementManagement/adminAnnouncementManagement.component';
import { AdminCompanyDetailsManagementComponent } from './pages/admin/companyDetailsManagement/adminCompanyDetailsManagement.component';
import { AdminComponent } from './pages/admin/adminLanding/admin.component';
import { AdminEmployeeManagementComponent } from './pages/admin/employeeManagement/adminEmployeeManagement.component';
import { AdminWfoManagementComponent } from './pages/admin/wfoManagement/adminWfoManagement.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { IndexComponent } from './pages/index/index.component';
import { JwtModule } from '@auth0/angular-jwt';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from './core/material.module';
import { NavbarComponent } from './sharedComponents/navbar/navbar.component';
import { NgModule } from '@angular/core';
import { PrimeNgModule } from './core/primeng.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { TOKEN_KEY } from './config';

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
    DepartmentInChargeOfComponent,
    DepartmentPartOfComponent,
    UploadEmployeeCSVComponent,
    NewDepartmentComponent,
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
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
    MatTableModule,
    PrimeNgModule,
    DragDropModule,
    DataViewModule,
    MatDialogModule,
    MatCheckboxModule,
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
export class AppModule {}
