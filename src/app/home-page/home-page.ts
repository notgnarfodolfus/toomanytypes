import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TypeMultiSelector } from '../type-multi-selector/type-multi-selector';
import { getTypeMultiplier, PokemonType, TYPES, TYPES_DEFAULT_ATTACK } from '../data';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';

export interface Rating {
  types: PokemonType[];
  rating: number;
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

  getAttack(): PokemonType[] {
    return this.attacker.controls.select.value ?? [];
  }

  getDefense(): PokemonType[] {
    return this.defender.controls.select.value ?? [];
  }

  getAttackRatings(atk: PokemonType): Rating[] {
    const ratings = TYPES.map((def) => {
      return { type: def, rating: getTypeMultiplier(atk, [def]) };
    }).filter((t) => t.rating !== 1);
    return this.groupByScore(ratings);
  }

  getMatchupRatings(): Rating[] {
    const defs = this.defender.controls.select.value;
    var atks = this.attacker.controls.select.value;
    if (!atks || atks.length === 0) atks = TYPES_DEFAULT_ATTACK;
    return this.getMatchupRatingsFor(atks, defs);
  }

  private getMatchupRatingsFor(
    attackTypes: PokemonType[] | null,
    defenseTypes: PokemonType[] | null,
  ): Rating[] {
    if (!attackTypes || !defenseTypes || attackTypes.length === 0 || defenseTypes.length === 0)
      return [];
    const ratings = attackTypes.map((atk) => {
      return { type: atk, rating: getTypeMultiplier(atk, defenseTypes) };
    });
    return this.groupByScore(ratings);
  }

  private groupByScore(attack: { type: PokemonType; rating: number }[]): Rating[] {
    const map = new Map<number, PokemonType[]>();
    attack.forEach((atk) => {
      const entries = map.get(atk.rating);
      if (entries) entries.push(atk.type);
      else map.set(atk.rating, [atk.type]);
    });
    const array: Rating[] = [];
    map.forEach((types, rating) => array.push({ types, rating }));
    array.sort((m1, m2) => m2.rating - m1.rating);
    return array;
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
