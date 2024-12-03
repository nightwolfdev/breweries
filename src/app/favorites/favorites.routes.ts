import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./favorites.component').then(c => c.FavoritesComponent)
    }
];
