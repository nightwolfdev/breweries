import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrAlertModule } from '@clr/angular';

import { Subscription, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { LoadingComponent, SearchFormComponent } from '../shared/components';
import { BreweriesService } from '../shared/services';

@Component({
    selector: 'brew-home',
    imports: [ClrAlertModule, LoadingComponent, SearchFormComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnDestroy, OnInit {

    private subscription = new Subscription();

    loading: boolean;
    loadingError: boolean;

    constructor(private breweriesSvc: BreweriesService) { }

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
