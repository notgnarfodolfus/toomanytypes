import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { PokemonType, TYPES } from '../data';

@Component({
  selector: 'app-type-multi-selector',
  imports: [
    CommonModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule,
  ],
  templateUrl: './type-multi-selector.html',
  styleUrl: './type-multi-selector.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TypeMultiSelector),
      multi: true,
    },
  ],
})
export class TypeMultiSelector implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() options: PokemonType[] = TYPES;
  @Input() maxSelection = 3;

  selectCtrl = new FormControl<PokemonType[]>([]);
  searchCtrl = new FormControl('');
  filteredOptions: PokemonType[] = [];

  private onChange: any = () => {};
  private onTouched: any = () => {};

  constructor() {
    this.filteredOptions = this.options;

    this.searchCtrl.valueChanges.subscribe((search) => {
      this.filteredOptions = this.options.filter((item) =>
        item.name.toLowerCase().includes((search || '').toLowerCase()),
      );
    });

    this.selectCtrl.valueChanges.subscribe((value) => {
      this.onChange(value);
      this.onTouched();
    });
  }

  ngOnChanges() {
    this.filteredOptions = this.options;
  }

  writeValue(value: PokemonType[]): void {
    this.selectCtrl.setValue(value || [], { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.selectCtrl.disable() : this.selectCtrl.enable();
  }

  remove(item: PokemonType) {
    const current = this.selectCtrl.value || [];
    this.selectCtrl.setValue(current.filter((i) => i !== item));
  }

  clearAll() {
    this.selectCtrl.setValue([]);
  }

  isDisabled(option: PokemonType): boolean {
    const selected = this.selectCtrl.value || [];
    return (
      this.maxSelection > 0 && selected.length >= this.maxSelection && !selected.includes(option)
    );
  }

  getChipColor(item: PokemonType): string {
    return '#ff5656';
  }
}
