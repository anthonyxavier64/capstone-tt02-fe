import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'form-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => NumberInputComponent),
    },
  ],
})
export class NumberInputComponent implements ControlValueAccessor {
  constructor() {}

  @Input()
  num: number = 0;
  _num: number = 0;

  get counterValue() {
    return this._num;
  }

  set counterValue(val) {
    this._num = val;
    this.propagateChange(this._num);
  }

  increment() {
    this.num++;
    this.propagateChange(this.num);
  }

  decrement() {
    this.num--;
    this.propagateChange(this.num);
  }

  onKey(event: any) {
    this.num = event.target.value;
    this.propagateChange(this.num);
  }

  writeValue(value: number) {
    if (value !== undefined) {
      this.num = value;
    }
  }

  propagateChange = (_: any) => {};

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}
}
