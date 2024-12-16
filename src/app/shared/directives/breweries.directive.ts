import { Directive, OnDestroy, OnInit } from '@angular/core';

import { Subscription, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { BreweriesService } from '../services';

@Directive()
export abstract class BreweriesDirective implements OnDestroy, OnInit {

    subscription = new Subscription();

    loading: boolean;
    loadingError: boolean;

    constructor(protected breweriesSvc: BreweriesService) { }

    ngOnInit() {
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
            ).subscribe();

        this.subscription.add(subscription);
    }

}
