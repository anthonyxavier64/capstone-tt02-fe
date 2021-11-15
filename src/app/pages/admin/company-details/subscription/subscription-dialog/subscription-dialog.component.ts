import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-subscription-dialog',
  templateUrl: './subscription-dialog.component.html',
  styleUrls: ['./subscription-dialog.component.css'],
  providers: [MessageService],
})
export class SubscriptionDialogComponent implements OnInit {
  subscriptionType: string;
  subscriptionTypes: string[];

  constructor(
    private dialogRef: MatDialogRef<SubscriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private paymentService: PaymentService,
    private messageService: MessageService
  ) {
    this.subscriptionType = data.subscriptionType;
    const subTypes = ['TIER1', 'TIER2', 'TIER3'];

    this.subscriptionTypes = subTypes.filter(
      (subscriptionType) => subscriptionType !== this.subscriptionType
    );
  }

  ngOnInit(): void {}

  handleChangeSubscription() {
    if (this.subscriptionType !== '') {
      this.paymentService
        .updateSubscription(this.data.companyId, this.subscriptionType)
        .subscribe(
          (response) => {
            this.dialogRef.close(this.subscriptionType);
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Unable to update subscription tier.',
            });
          }
        );
    }
  }
}
