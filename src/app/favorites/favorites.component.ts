import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrAlertModule } from '@clr/angular';

import { Observable, Subscription, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs';

import { BreweryComponent, LoadingComponent } from '../shared/components';
import { Brewery } from '../shared/interfaces';
import { BreweriesService } from '../shared/services';

@Component({
    selector: 'brew-favorites',
    imports: [BreweryComponent, ClrAlertModule, CommonModule, LoadingComponent],
    templateUrl: './favorites.component.html',
    styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnDestroy, OnInit {

    private subscription = new Subscription();

    favorites$: Observable<Brewery[]>;
    loading: boolean;
    loadingError: boolean;

    constructor(private breweriesSvc: BreweriesService) { }

    ngOnInit() {
        this.favorites$ = this.breweriesSvc.favorites$;
        this.getBreweries();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    getBreweries() {
        this.loading = true;
        this.loadingError = false;

        const subscription = this.breweriesSvc
            .getBreweries()
            .pipe(
                tap(() => this.loading = false),
                catchError(error => {
                    this.loading = false;
                    this.loadingError = true;
                    return throwError(() => new Error(error.message));
                })
            )
            .subscribe();

        this.subscription.add(subscription);
    }

}
