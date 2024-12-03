import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        title: 'Breweries'
    },
    {
        path: 'favorites',
        loadChildren: () => import('./favorites/favorites.routes').then(r => r.routes),
        title: 'Favorites'
    },
    {
        path: 'about',
        loadChildren: () => import('./about/about.routes').then(r => r.routes),
        title: 'About'
    },
    {
        path: 'search',
        loadChildren: () => import('./search/search.routes').then(r => r.routes),
        title: 'Search Results'
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    {
        path: '*',
        redirectTo: 'home'
    }
];