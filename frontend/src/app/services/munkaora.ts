import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MunkaoraService {
  private apiUrl = 'http://localhost:3000/api/munkaorak';
  private http = inject(HttpClient);

  ujMunkaoraRogzitese(adatok: any) {
    return this.http.post(`${this.apiUrl}/uj`, adatok);
  }

  orakLekerese(felhasznaloId: string) {
    return this.http.get(`${this.apiUrl}/${felhasznaloId}`);
  }

  munkaoraTorlese(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // ÚJ FÜGGVÉNY: Elküldi a felülírt adatokat a backendnek
  munkaoraSzerkesztese(id: string, adatok: any) {
    return this.http.put(`${this.apiUrl}/${id}`, adatok);
  }
}