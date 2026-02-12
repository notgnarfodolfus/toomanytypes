import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TypeMultiSelector } from '../type-multi-selector/type-multi-selector';
import { getTypeMultiplier, PokemonType, TYPES } from '../data';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';

export interface Rating {
  attacker: PokemonType[];
  rating: number;
  color?: string;
}

@Component({
  selector: 'app-home-page',
  imports: [
    CommonModule,
    TypeMultiSelector,
    ReactiveFormsModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatListModule,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  attacker = new FormGroup({ select: new FormControl<PokemonType[]>([]) });
  defender = new FormGroup({ select: new FormControl<PokemonType[]>([]) });

  hasDefender(): boolean {
    const defs = this.defender.controls.select.value;
    return defs != null && defs.length > 0;
  }

  getMatchupRatings(): Rating[] {
    const defs = this.defender.controls.select.value;
    var atks = this.attacker.controls.select.value;
    if (!atks || atks.length === 0) atks = TYPES;
    return this.getMatchupRatingsFor(atks, defs);
  }

  private getMatchupRatingsFor(
    attackTypes: PokemonType[] | null,
    defenseTypes: PokemonType[] | null,
  ): Rating[] {
    if (!attackTypes || !defenseTypes || attackTypes.length === 0 || defenseTypes.length === 0)
      return [];
    const attackRatings = new Map<number, PokemonType[]>();
    attackTypes.forEach((atk) => {
      const rating = getTypeMultiplier(atk, defenseTypes);
      const entries = attackRatings.get(rating);
      if (entries) entries.push(atk);
      else attackRatings.set(rating, [atk]);
    });
    const ratings: Rating[] = [];
    attackRatings.forEach((attacker, rating) =>
      ratings.push({ attacker, rating, color: this.getRatingColor(rating) }),
    );
    ratings.sort((m1, m2) => m2.rating - m1.rating);
    return ratings;
  }

  getRatingColor(rating: number): string | undefined {
    if (rating >= 8) return '#ff0000';
    if (rating >= 4) return '#d40e0e';
    if (rating >= 2) return '#ab1c1c';
    if (rating >= 1) return undefined;
    if (rating >= 0.5) return '#1cab1c';
    if (rating >= 0.25) return '#0ed40e';
    if (rating >= 0.01) return '#00ff00';
    else return '#77cfcf';
  }
}
