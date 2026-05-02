import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) { }

  // Bejelentkezés
  bejelentkezes(email: string, jelszo: string) {
    return this.http.post(`${this.apiUrl}/login`, { email, jelszo });
  }

  // ÚJ: Ez menti el a dolgozót az adatbázisba
  regisztracio(adatok: any) {
    return this.http.post(`${this.apiUrl}/uj`, adatok);
  }
}