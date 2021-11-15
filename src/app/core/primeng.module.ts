import { NgModule } from '@angular/core';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  exports: [
    InputTextModule,
    ButtonModule,
    ToastModule,
    DropdownModule,
    DialogModule,
    ListboxModule,
    MultiSelectModule,
    ConfirmDialogModule,
  ],
})
export class PrimeNgModule {}
