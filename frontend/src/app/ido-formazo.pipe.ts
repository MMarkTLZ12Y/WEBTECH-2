import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'idoFormazo',
  standalone: true // Fontos, hogy standalone legyen!
})
export class IdoFormazoPipe implements PipeTransform {
  transform(orakSzama: number): string {
    if (!orakSzama && orakSzama !== 0) return '';

    // Átváltjuk az egészet percre (pl. 1.25 óra -> 75 perc)
    const osszPerc = Math.round(orakSzama * 60);

    const orak = Math.floor(osszPerc / 60); // Hány teljes óra van benne? (75 / 60 = 1)
    const percek = osszPerc % 60; // Mi a maradék? (75 % 60 = 15)

    let eredmeny = '';
    
    if (orak > 0) {
      eredmeny += `${orak} óra `;
    }
    
    if (percek > 0 || orak === 0) { // Ha csak percek vannak, azt is írjuk ki (pl. 10 perc)
       eredmeny += `${percek} perc`;
    }

    return eredmeny.trim();
  }
}