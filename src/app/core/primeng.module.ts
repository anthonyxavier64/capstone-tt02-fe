import { NgModule } from '@angular/core';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  exports: [InputTextModule, ButtonModule, ToastModule, DropdownModule],
})
export class PrimeNgModule {}
