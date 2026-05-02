import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { Admin } from './components/admin/admin'; // <-- Fontos: Importáld be az admint!

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'admin', component: Admin }, // <-- Ez a sor hiányzott!
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];