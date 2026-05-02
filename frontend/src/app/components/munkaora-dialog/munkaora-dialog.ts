import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips'; // <-- ÚJ: Chipek importálása
import { FormsModule } from '@angular/forms';
import { MunkaoraService } from '../../services/munkaora'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-munkaora-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule, // <-- ÚJ: Bekötve a HTML-hez
    FormsModule
  ],
  templateUrl: './munkaora-dialog.html',
  styleUrl: './munkaora-dialog.scss'
})
export class MunkaoraDialog implements OnInit {
  dialogRef = inject(MatDialogRef<MunkaoraDialog>);
  munkaoraService = inject(MunkaoraService); 
  kapottAdat = inject(MAT_DIALOG_DATA, { optional: true });

  // ÚJ: A választható kategóriák listája
  valaszthatoKategoriak: string[] = ['Könyvelés', 'Szállítás', 'Áruátvétel', 'Adminisztráció', 'Egyéb'];
  
  datum = '';
  kezdes = '';    
  befejezes = ''; 
  orakSzama: number | null = null;
  formazottIdo = ''; 
  
  kategoria = ''; // <-- ÚJ: Ide mentjük a kiválasztott chipet
  leiras = '';
  szerkesztesMod = false;

  ngOnInit() {
    if (this.kapottAdat) {
      this.szerkesztesMod = true;
      this.datum = new Date(this.kapottAdat.datum).toISOString().split('T')[0];
      this.kezdes = this.kapottAdat.kezdes || '';       
      this.befejezes = this.kapottAdat.befejezes || ''; 
      this.orakSzama = this.kapottAdat.orakSzama;
      this.kategoria = this.kapottAdat.kategoria || ''; // Betöltjük a régit
      this.leiras = this.kapottAdat.leiras || '';
      
      if (this.orakSzama) {
          this.idokFormazasaSzovegge(this.orakSzama);
      }
    } else {
      const ma = new Date();
      const ev = ma.getFullYear();
      const ho = String(ma.getMonth() + 1).padStart(2, '0');
      const nap = String(ma.getDate()).padStart(2, '0');
      this.datum = `${ev}-${ho}-${nap}`; 
    }
  }

  idokSzamitasa() {
    if (this.kezdes && this.befejezes) {
      const [startOra, startPerc] = this.kezdes.split(':').map(Number);
      const [vegOra, vegPerc] = this.befejezes.split(':').map(Number);

      const osszStartPerc = startOra * 60 + startPerc;
      let osszVegPerc = vegOra * 60 + vegPerc;

      if (osszVegPerc < osszStartPerc) osszVegPerc += 24 * 60;

      const kulonbsegPercben = osszVegPerc - osszStartPerc;
      this.orakSzama = Math.round((kulonbsegPercben / 60) * 100) / 100;
      
      this.idokFormazasaSzovegge(this.orakSzama);
    }
  }

  idokFormazasaSzovegge(orakSzamaDecimal: number) {
      const osszPerc = Math.round(orakSzamaDecimal * 60);
      const orak = Math.floor(osszPerc / 60);
      const percek = osszPerc % 60;

      let eredmeny = '';
      if (orak > 0) eredmeny += `${orak} óra `;
      if (percek > 0 || orak === 0) eredmeny += `${percek} perc`;
      
      this.formazottIdo = eredmeny.trim();
  }

  mentes() {
    // Biztonsági ellenőrzés: muszáj kategóriát és időt megadni!
    if (!this.orakSzama || !this.kategoria) {
      alert('Kérlek válaszd ki a kezdés/befejezés idejét és a feladat kategóriáját!');
      return;
    }

    const userString = localStorage.getItem('felhasznalo');
    if (!userString) return; 
    const bejelentkezettUser = JSON.parse(userString);

    const ujAdat = {
      felhasznaloId: bejelentkezettUser._id,
      datum: this.datum,
      kezdes: this.kezdes,
      befejezes: this.befejezes,
      orakSzama: this.orakSzama,
      kategoria: this.kategoria, // Ezt is küldjük a backendnek
      leiras: this.leiras
    };

    if (this.szerkesztesMod) {
      this.munkaoraService.munkaoraSzerkesztese(this.kapottAdat._id, ujAdat).subscribe({
        next: () => this.dialogRef.close('kesz'),
        error: (hiba) => alert('❌ Hiba: ' + hiba.error.hiba)
      });
    } else {
      this.munkaoraService.ujMunkaoraRogzitese(ujAdat).subscribe({
        next: () => this.dialogRef.close('kesz'),
        error: (hiba) => alert('❌ Hiba: ' + hiba.error.hiba)
      });
    }
  }

  megse() {
    this.dialogRef.close();
  }
}