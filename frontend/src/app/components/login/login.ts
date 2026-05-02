import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  beirtEmail = '';
  beirtJelszo = '';

  authService = inject(AuthService);
  router = inject(Router);

  belepes() {
    this.authService.bejelentkezes(this.beirtEmail, this.beirtJelszo).subscribe({
      next: (valasz: any) => {
        if (valasz && valasz.user) {
          // Elmentjük a friss adatokat (szerepkorral együtt)
          localStorage.setItem('felhasznalo', JSON.stringify(valasz.user));
          
          // Ellenőrizzük, hogy admin-e (szerepkor alapján)
          const isAdmin = valasz.user.szerepkor === 'admin' || valasz.user.isAdmin === true;

          if (isAdmin) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        }
      },
      error: (hiba) => {
        alert('❌ Hiba: ' + (hiba.error?.hiba || 'Szerver hiba'));
      }
    });
  }
}