import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-color-selector-dialog',
  templateUrl: './color-selector-dialog.component.html',
  styleUrls: ['./color-selector-dialog.component.css'],
})
export class ColorSelectorDialogComponent implements OnInit {
  colors: string[];
  chosenColor: string;

  constructor(
    public dialogRef: MatDialogRef<ColorSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { colors: string[]; chosen: string }
  ) {
    this.colors = data.colors;
    this.chosenColor = data.chosen;
  }

  ngOnInit(): void {}

  setColor(color: any): void {
    this.chosenColor = color;
  }

  close(): void {
    this.data.chosen = this.chosenColor;
    this.dialogRef.close({ data: this.chosenColor });
  }
}
