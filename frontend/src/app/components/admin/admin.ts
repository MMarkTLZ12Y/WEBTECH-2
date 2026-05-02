import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IdoFormazoPipe } from '../../ido-formazo.pipe';
import { AuthService } from '../../services/auth';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatButtonModule,
    MatIconModule, MatInputModule, MatFormFieldModule, IdoFormazoPipe
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin implements OnInit {
  router = inject(Router);
  titleService = inject(Title);
  authService = inject(AuthService);
  adminService = inject(AdminService);
  cdr = inject(ChangeDetectorRef);

  bejelentkezettAdmin: any = null;
  isDarkMode = false;
  
  megjelenitettHetfo: Date = new Date();
  
  ujDolgozo = { nev: '', email: '', jelszo: '', jelszoUjra: '' };
  dolgozokStatisztikakkal: any[] = [];

  ngOnInit() {
    this.titleService.setTitle('Admin Vezérlőpult - Kovács Bt.');
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    if (this.isDarkMode) document.body.classList.add('dark-theme');

    const mentettAdat = localStorage.getItem('felhasznalo');
    if (mentettAdat) {
      this.bejelentkezettAdmin = JSON.parse(mentettAdat);
      const valobanAdmin = this.bejelentkezettAdmin.szerepkor === 'admin' || this.bejelentkezettAdmin.isAdmin === true;
      if (!valobanAdmin) {
        this.router.navigate(['/dashboard']);
      } else {
        this.hetKiszamitasa(new Date()); 
        this.dolgozokBetoltese();
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  hetKiszamitasa(datum: Date) {
    const d = new Date(datum);
    const napIndex = d.getDay() === 0 ? 7 : d.getDay();
    d.setDate(d.getDate() - napIndex + 1);
    d.setHours(0, 0, 0, 0);
    this.megjelenitettHetfo = d;
  }

  valtas(irany: number) {
    if (irany === 0) {
      this.hetKiszamitasa(new Date());
    } else {
      const ujDatum = new Date(this.megjelenitettHetfo);
      ujDatum.setDate(ujDatum.getDate() + irany);
      this.megjelenitettHetfo = ujDatum;
    }
    this.dolgozokBetoltese();
  }

  dolgozokBetoltese() {
    const d = this.megjelenitettHetfo;
    const ev = d.getFullYear();
    const honap = String(d.getMonth() + 1).padStart(2, '0');
    const nap = String(d.getDate()).padStart(2, '0');
    const datumString = `${ev}-${honap}-${nap}`; 
    
    this.adminService.getStatisztikak(datumString).subscribe({
      next: (valasz) => {
        this.dolgozokStatisztikakkal = valasz.adatok;
        this.cdr.detectChanges();
      },
      error: (err) => alert('Hiba a dolgozók betöltésekor!')
    });
  }

  uzenetMentese(dolgozo: any) {
    this.adminService.uzenetKuldese(dolgozo._id, dolgozo.uzenet).subscribe({
      next: () => alert(`Üzenet elmentve ${dolgozo.nev} részére!`),
      error: () => alert('Hiba az üzenet mentésekor!')
    });
  }

  ujFiokRegisztralasa() {
    // 1. Üres mezők
    if (!this.ujDolgozo.email || !this.ujDolgozo.jelszo || !this.ujDolgozo.jelszoUjra || !this.ujDolgozo.nev) {
      alert('Kérlek, tölts ki minden mezőt!');
      return;
    }

    // 2. Email ellenőrzés
    const emailMintazat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailMintazat.test(this.ujDolgozo.email)) {
      alert('❌ Érvénytelen e-mail cím formátum!');
      return;
    }

    // 3. SZIGORÚ JELSZÓ ELLENŐRZÉS (RegEx)
    // Magyarázat: Kisbetű, Nagybetű, Szám, Speciális karakter, min. 6 karakter
    const jelszoMintazat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{6,}$/;
    
    if (!jelszoMintazat.test(this.ujDolgozo.jelszo)) {
      alert('❌ Túl gyenge jelszó!\n\nElvárások:\n- Legalább 6 karakter\n- Kis- és nagybetű\n- Legalább egy szám\n- Legalább egy speciális karakter (@$!%*?&.)');
      return;
    }

    // 4. Jelszavak egyezése
    if (this.ujDolgozo.jelszo !== this.ujDolgozo.jelszoUjra) {
      alert('❌ A két jelszó nem egyezik!');
      return;
    }

    const kuldendoAdat = { ...this.ujDolgozo, szerepkor: 'dolgozó' };

    this.authService.regisztracio(kuldendoAdat).subscribe({
      next: () => {
        alert('✅ Sikeres regisztráció!');
        this.ujDolgozo = { nev: '', email: '', jelszo: '', jelszoUjra: '' };
        this.dolgozokBetoltese();
      },
      error: (err) => alert('❌ Hiba: ' + (err.error?.hiba || 'Szerver hiba'))
    });
  }

  torlesInditasa(dolgozo: any) {
    const megerosites = prompt(`Törléshez írd be: ${dolgozo.email}`);
    if (megerosites === dolgozo.email) {
      this.adminService.felhasznaloTorlese(dolgozo._id).subscribe({
        next: () => {
          alert('Törölve!');
          this.dolgozokBetoltese();
        }
      });
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    document.body.classList.toggle('dark-theme', this.isDarkMode);
  }

  kijelentkezes() {
    localStorage.removeItem('felhasznalo');
    document.body.classList.remove('dark-theme');
    this.router.navigate(['/login']);
  }
}