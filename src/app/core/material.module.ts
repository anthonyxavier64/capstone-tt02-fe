import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
<<<<<<< HEAD
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  exports: [MatButtonModule, MatIconModule, MatCardModule, MatRadioModule,
    MatInputModule, MatFormFieldModule, MatSelectModule, MatTabsModule, MatDialogModule,
    MatExpansionModule],
=======

@NgModule({
  exports: [MatButtonModule, MatIconModule, MatCardModule, MatRadioModule,
    MatInputModule, MatFormFieldModule, MatSelectModule, MatTabsModule, MatDialogModule],
>>>>>>> e7ee119 ([Announcement CRUD]created files for announcement model,added create and view ops under announcement management, created view edit & delete announcement components)
})
export class MaterialModule { }
