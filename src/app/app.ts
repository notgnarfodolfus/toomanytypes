import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TypeMultiSelector } from './type-multi-selector/type-multi-selector';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { PokemonType } from './data';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, TypeMultiSelector, ReactiveFormsModule, MatFormFieldModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('toomanytypes');

  form = new FormGroup({
    attacker: new FormControl<PokemonType[]>([]),
    defender: new FormControl<PokemonType[]>([]),
  });
}
