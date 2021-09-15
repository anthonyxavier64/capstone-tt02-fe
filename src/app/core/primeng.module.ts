import { NgModule } from '@angular/core';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@NgModule({
  exports: [
    InputTextModule,
    ButtonModule,
    ToastModule,
  ]
})
export class PrimeNgModule { }
