import { Routes } from '@angular/router';
import { TabsComponent } from './tabs/tabs.component';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsComponent,
    canActivate: [AuthGuard], // ✅ protege todo tabs
    children: [
      {
        path: 'home',
        canActivate: [AuthGuard],
        loadComponent: () => import('./home/home.page').then(m => m.HomePage)
      },
      {
        path: 'premiere',
        canActivate: [AuthGuard],
        loadComponent: () => import('./premiere/premiere.page').then(m => m.PremierePage)
      },
      {
        path: 'library',
        canActivate: [AuthGuard],
        loadComponent: () => import('./cartelera/cartelera.page').then(m => m.CarteleraPage)
      },
      {
        path: 'search',
        canActivate: [AuthGuard],
        loadComponent: () => import('./search/search.page').then(m => m.SearchPage)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'detail/:id',
    canActivate: [AuthGuard], // ✅ protegido también
    loadComponent: () => import('./detail/detail.page').then(m => m.DetailPage)
  },
  {
    path: 'login',
      canActivate: [NoAuthGuard],

    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
      canActivate: [NoAuthGuard],

    loadComponent: () => import('./register/register.page').then(m => m.RegisterPage)
  }
];
