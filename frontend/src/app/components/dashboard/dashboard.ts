import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser'; // <-- ÚJ: Title service importálása
import { CommonModule } from '@angular/common'; 
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu'; // <-- ÚJ: Menü importálása a lenyíló gombhoz
import { MunkaoraDialog } from '../munkaora-dialog/munkaora-dialog';
import { MunkaoraService } from '../../services/munkaora'; 
import { IdoFormazoPipe } from '../../ido-formazo.pipe'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatMenuModule, // <-- ÚJ: Menü modul hozzáadása
    IdoFormazoPipe
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  router = inject(Router);
  dialog = inject(MatDialog);
  munkaoraService = inject(MunkaoraService); 
  cdr = inject(ChangeDetectorRef);
  titleService = inject(Title); // <-- ÚJ: Injectáljuk a Title service-t

  bejelentkezettFelhasznalo: any = null;
  rogzitettOrak: any[] = []; 
  csoportositottOrak: any[] = [];

  hetiOra = 0;
  haviOra = 0;
  eviOra = 0;
  osszesOra = 0; 

  // ÚJ: Változó a sötét mód állapotának tárolására
  isDarkMode = false;

  ngOnInit() {
    // ÚJ: Beállítjuk a böngészőfül feliratát programozottan is
    this.titleService.setTitle('Kovács Bt. - Munkaóra Nyilvántartó');

    // ÚJ: Megnézzük a mentett sötét mód állapotot
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
    }

    const mentettAdat = localStorage.getItem('felhasznalo');
    if (mentettAdat) {
      this.bejelentkezettFelhasznalo = JSON.parse(mentettAdat);
      this.orakBetoltese(); 
    } else {
      this.router.navigate(['/login']);
    }
  }

  // ÚJ: A kapcsoló gomb logikája
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  orakBetoltese() {
    this.munkaoraService.orakLekerese(this.bejelentkezettFelhasznalo._id).subscribe({
      next: (adatok: any) => {
        this.rogzitettOrak = adatok;
        this.adatokFeldolgozasa();
      },
      error: (hiba) => console.error(hiba)
    });
  }

  adatokFeldolgozasa() {
    this.rogzitettOrak.sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime());
    this.csoportositottOrak = [];
    this.hetiOra = 0;
    this.haviOra = 0;
    this.eviOra = 0;
    this.osszesOra = 0;

    const ma = new Date();
    const maiEv = ma.getFullYear();
    const maiHo = ma.getMonth();
    const maiHetFelirat = this.getHetHatarok(ma);

    for (let ora of this.rogzitettOrak) {
      const d = new Date(ora.datum);
      const ev = d.getFullYear();
      const hetFelirat = this.getHetHatarok(d);
      const napFelirat = this.getNapFelirat(d);

      this.osszesOra += ora.orakSzama;
      if (ev === maiEv) {
        this.eviOra += ora.orakSzama;
        if (d.getMonth() === maiHo) {
          this.haviOra += ora.orakSzama;
        }
      }
      if (hetFelirat === maiHetFelirat && ev === maiEv) {
        this.hetiOra += ora.orakSzama;
      }

      let evCsoport = this.csoportositottOrak.find(c => c.ev === ev);
      if (!evCsoport) {
        evCsoport = { ev: ev, hetek: [] };
        this.csoportositottOrak.push(evCsoport);
      }

      let hetCsoport = evCsoport.hetek.find((h: any) => h.hetFelirat === hetFelirat);
      if (!hetCsoport) {
        hetCsoport = { hetFelirat: hetFelirat, napok: [] };
        evCsoport.hetek.push(hetCsoport);
      }

      let napCsoport = hetCsoport.napok.find((n: any) => n.napFelirat === napFelirat);
      if (!napCsoport) {
        napCsoport = { napFelirat: napFelirat, orak: [] };
        hetCsoport.napok.push(napCsoport);
      }

      napCsoport.orak.push(ora);
    }
    this.cdr.detectChanges(); 
  }

  // =========================================================================
  // ÚJ FÜGGVÉNY: Létrehozza a szöveget (mind az email, mind a másolás számára)
  // =========================================================================
  getHetiOsszefoglaloAdatai() {
    const pipe = new IdoFormazoPipe();
    const formazottHetiIdo = pipe.transform(this.hetiOra);
    const ma = new Date();
    const maiEv = ma.getFullYear();
    const maiHetFelirat = this.getHetHatarok(ma);
    
    // Csak a jelenlegi hét óráit szedjük ki
    const eHetiOrak = this.rogzitettOrak.filter(ora => {
      const d = new Date(ora.datum);
      return this.getHetHatarok(d) === maiHetFelirat && d.getFullYear() === maiEv;
    });
    
    // Időrendbe rakjuk hétfőtől kezdve
    eHetiOrak.sort((a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime());

    let reszletezes = '';
    if (eHetiOrak.length > 0) {
      let aktualisNap = '';
      for (let ora of eHetiOrak) {
        const napNeve = this.getNapFelirat(ora.datum);
        
        if (aktualisNap !== napNeve) {
          aktualisNap = napNeve;
          reszletezes += `\n📅 ${aktualisNap}:\n`;
        }
        
        const formzottIdo = pipe.transform(ora.orakSzama);
        const leirasText = ora.leiras ? ` - ${ora.leiras}` : '';
        const idopontText = (ora.kezdes && ora.befejezes) ? ` (${ora.kezdes}-${ora.befejezes})` : '';
        
        reszletezes += `   • ${ora.kategoria}${idopontText}: ${formzottIdo}${leirasText}\n`;
      }
    } else {
      reszletezes = '\nEzen a héten nem történt még órarögzítés.\n';
    }

    const hetiIntervallum = maiHetFelirat.replace(' hete', '');
    const cimzett = "igazgato@kovacsbt.hu";
    const targy = `Heti munkaösszefoglaló - ${this.bejelentkezettFelhasznalo.nev} - Kovács Bt.`;
    
    let torzs = `Tisztelt Kovács Tibor Igazgató Úr!\n\n`;
    torzs += `Ezúton küldöm a heti munkaösszefoglalómat a ${hetiIntervallum} közötti időszakról.\n\n`;
    torzs += `A héten összesen ${formazottHetiIdo} időt töltöttem munkavégzéssel a Kovács Bt. keretein belül. Az elvégzett feladatok napi bontásban:\n`;
    torzs += reszletezes;
    torzs += `\nSzép hétvégét kívánok!\n\nÜdvözlettel,\n${this.bejelentkezettFelhasznalo.nev}`;

    return { cimzett: cimzett, targy: targy, torzs: torzs };
  }

  emailGeneralas() {
    const adatok = this.getHetiOsszefoglaloAdatai();
    const mailtoLink = `mailto:${adatok.cimzett}?subject=${encodeURIComponent(adatok.targy)}&body=${encodeURIComponent(adatok.torzs)}`;
    window.location.href = mailtoLink;
  }

  vagolapraMasolas() {
    const adatok = this.getHetiOsszefoglaloAdatai();
    
    // Pontosan a kért formázás elválasztó vonalakkal
    const masolandoSzoveg = `${adatok.cimzett}\n------------------\n${adatok.targy}\n------------------\n${adatok.torzs}`;
    
    navigator.clipboard.writeText(masolandoSzoveg).then(() => {
      alert('✅ Sikeres másolás!\nAz e-mail címe, a tárgy és a szöveg a vágólapra került.');
    }).catch(err => {
      console.error('Hiba a másolás során: ', err);
      alert('❌ Nem sikerült a vágólapra másolni!');
    });
  }

  getHetHatarok(datum: Date | string) {
    const d = new Date(datum);
    const napIndex = d.getDay() === 0 ? 7 : d.getDay();
    const hetfo = new Date(d);
    hetfo.setDate(d.getDate() - napIndex + 1);
    const vasarnap = new Date(hetfo);
    vasarnap.setDate(hetfo.getDate() + 6);
    const hoHetfo = String(hetfo.getMonth() + 1).padStart(2, '0');
    const napHetfo = String(hetfo.getDate()).padStart(2, '0');
    const hoVas = String(vasarnap.getMonth() + 1).padStart(2, '0');
    const napVas = String(vasarnap.getDate()).padStart(2, '0');
    return `${hoHetfo}.${napHetfo}. - ${hoVas}.${napVas}. hete`;
  }

  getNapFelirat(datum: Date | string) {
    const d = new Date(datum);
    const napok = ['vasárnap', 'hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat'];
    const ho = String(d.getMonth() + 1).padStart(2, '0');
    const nap = String(d.getDate()).padStart(2, '0');
    return `${ho}.${nap}., ${napok[d.getDay()]}`;
  }

  ujMunkaoraAblakNyitasa() {
    // ÚJ: panelClass átadása, ha sötét módban vagyunk
    const dialogRef = this.dialog.open(MunkaoraDialog, { 
      width: '450px',
      panelClass: this.isDarkMode ? 'dark-theme-dialog' : ''
    });
    dialogRef.afterClosed().subscribe(eredmeny => { 
      if (eredmeny === 'kesz') {
        this.orakBetoltese(); 
      }
    });
  }

  oraSzerkesztese(kivalasztottOra: any) {
    // ÚJ: panelClass átadása, ha sötét módban vagyunk
    const dialogRef = this.dialog.open(MunkaoraDialog, { 
      width: '450px', 
      data: kivalasztottOra,
      panelClass: this.isDarkMode ? 'dark-theme-dialog' : ''
    });
    dialogRef.afterClosed().subscribe(eredmeny => { 
      if (eredmeny === 'kesz') {
        this.orakBetoltese(); 
      }
    });
  }

  kijelentkezes() {
    localStorage.removeItem('felhasznalo');
    
    // ÚJ: Lekapcsoljuk a sötét módot, mielőtt átlépünk a Login oldalra
    document.body.classList.remove('dark-theme'); 
    
    this.router.navigate(['/login']);
  }

  oraTorlese(oraId: string) {
    if (confirm('Biztosan törölni szeretnéd ezt a munkaórát?')) {
      this.munkaoraService.munkaoraTorlese(oraId).subscribe({
        next: () => {
          this.rogzitettOrak = this.rogzitettOrak.filter(ora => ora._id !== oraId);
          this.adatokFeldolgozasa();
        },
        error: () => alert('❌ Hiba történt a törlés során!')
      });
    }
  }
}