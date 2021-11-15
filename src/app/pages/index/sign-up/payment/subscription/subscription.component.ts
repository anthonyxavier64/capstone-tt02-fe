import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from 'src/app/services/company/company.service';
import * as moment from 'moment';
import { PaymentService } from 'src/app/services/payment/payment.service';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
} from 'primeng/api';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class SubscriptionComponent implements OnInit {
  subscriptionType: string;
  amount: number;
  creditCardNumber: string;
  cvv: number;
  cardHolderName: string;
  CCDateOfExpiry: Date;
  expiry: string;
  companyCreationRequestId: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,
    private paymentService: PaymentService,
    private messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    const hash = this.activatedRoute.snapshot.params.hash;

    this.companyService.getCompanyCreationRequestByHash(hash).subscribe(
      (response) => {
        const request = response.companyCreationRequest;

        this.companyCreationRequestId = request.companyCreationRequestId;

        this.creditCardNumber = request.creditCardNumber;
        this.cardHolderName = request.cardHolderName;
        this.cvv = request.cvv;

        this.expiry = moment(request.CCDateOfExpiry).format('MM/YY');

        this.CCDateOfExpiry = request.CCDateOfExpiry;

        this.subscriptionType = request.subscriptionType;

        if (request.subscriptionType === 'TIER1') {
          this.amount = 200;
        } else if (request.subscriptionType === 'TIER2') {
          this.amount = 300;
        } else {
          this.amount = 500;
        }
      },
      (error) => {}
    );
  }

  selectMonth(normalizedDate, dp) {
    this.expiry = moment(normalizedDate).format('MM/YY');
    this.CCDateOfExpiry = normalizedDate;
    dp.close();
  }

  pay() {
    const creditCardDetails = {
      creditCardNumber: this.creditCardNumber,
      cardHolderName: this.cardHolderName,
      cvv: this.cvv,
      CCDateOfExpiry: this.CCDateOfExpiry,
    };

    this.paymentService
      .createSubscription(this.companyCreationRequestId, creditCardDetails)
      .subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Confirmed',
            detail: 'Payment was successful!',
          });
          this.openSuccessDialog();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Unable to make payment. Please try again.',
          });
        }
      );
  }

  openSuccessDialog() {
    this.confirmationService.confirm({
      message: 'Would you like to be redirect to the log in page?',
      header: 'Payment Successful',
      accept: () => {
        this.router.navigateByUrl('/login');
      },
    });
  }

  openConfirmDialog() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Payment Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.pay();
      },
    });
  }
}
