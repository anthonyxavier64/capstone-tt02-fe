import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/user/auth.service';

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService],
})
export class LoginComponent implements OnInit, AfterViewInit {
  email: string;
  password: string;

  constructor(
    private cdRef: ChangeDetectorRef,
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.email = '';
    this.password = '';
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  handleLogin() {
    this.auth.login(this.email, this.password).then((response) => {
      if (!!response) {
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.router.navigateByUrl('/admin');

        // The following code is only when DB does not work (ie need to cache).
        const allUsers = [
          {
            id: 1,
            fullName: 'First User',
            email: '1@test.com',
            password:
              '$2a$10$O.FiOY9TAl.qi.zYqa.qsuIGesVsHXjtrFHl85t2jz3X4YWsFpPQG',
            contactNumber: '12345678',
            isVaccinated: true,
            isActivated: true,
            numLeavesAllocated: 14,
            numLeavesTaken: 2,
            datesInOffice: JSON.stringify([]),
            shnMedicalCerts: JSON.stringify([]),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 2,
            fullName: 'Second User',
            email: '2@test.com',
            password:
              '$2a$10$O.FiOY9TAl.qi.zYqa.qsuIGesVsHXjtrFHl85t2jz3X4YWsFpPQG',
            contactNumber: '12345678',
            isVaccinated: true,
            isActivated: true,
            numLeavesAllocated: 14,
            numLeavesTaken: 2,
            datesInOffice: JSON.stringify([]),
            shnMedicalCerts: JSON.stringify([]),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 3,
            fullName: 'Third User',
            email: '3@test.com',
            password:
              '$2a$10$O.FiOY9TAl.qi.zYqa.qsuIGesVsHXjtrFHl85t2jz3X4YWsFpPQG',
            contactNumber: '12345678',
            isVaccinated: true,
            isActivated: true,
            numLeavesAllocated: 14,
            numLeavesTaken: 2,
            datesInOffice: JSON.stringify([]),
            shnMedicalCerts: JSON.stringify([]),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];

        const allDepts = [
          {
            departmentId: 1,
            name: 'HR',
          },
          {
            departmentId: 2,
            name: 'Finance',
          },
          {
            departmentId: 3,
            name: 'ICT',
          },
        ];

        localStorage.setItem('allUsers', JSON.stringify(allUsers));
        localStorage.setItem('allDepts', JSON.stringify(allDepts));
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to log in. Please try again.',
        });
      }
    });
  }

  handleLoginPopup() { }
}
