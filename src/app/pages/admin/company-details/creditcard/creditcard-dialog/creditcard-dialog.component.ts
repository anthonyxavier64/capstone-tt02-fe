import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';

@Component({
  selector: 'app-creditcard-dialog',
  templateUrl: './creditcard-dialog.component.html',
  styleUrls: ['./creditcard-dialog.component.css'],
  providers: [MessageService],
})
export class CreditcardDialogComponent implements OnInit {
  creditCard: any;
  expiry: string;

  constructor(
    private dialogRef: MatDialogRef<CreditcardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private paymentService: PaymentService,
    private messageService: MessageService
  ) {
    this.creditCard = data.creditCard;

    this.expiry = moment(this.creditCard.CCDateOfExpiry).format('MM/YY');
  }

  ngOnInit(): void {}

  selectMonth(normalizedDate, dp) {
    this.expiry = moment(normalizedDate).format('MM/YY');
    this.creditCard.CCDateOfExpiry = normalizedDate;
    dp.close();
  }

  handleSave() {
    this.paymentService
      .updateCreditCard(this.creditCard, this.data.companyId)
      .subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Credit card has been updated.',
          });

          this.dialogRef.close(this.creditCard);
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Unable to update credit card.',
          });
        }
      );
  }
}
