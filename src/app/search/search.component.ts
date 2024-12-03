import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClrAlertModule } from '@clr/angular';

import { BehaviorSubject, combineLatest, Observable, Subscription, throwError } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';

import { BreweryComponent, LoadingComponent } from '../shared/components';
import { Brewery, SearchCriteria } from '../shared/interfaces';
import { BreweriesService } from '../shared/services';

@Component({
    selector: 'brew-search',
    imports: [BreweryComponent, ClrAlertModule, CommonModule, LoadingComponent],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss',
})
export class SearchComponent implements OnDestroy, OnInit {
    private subscription = new Subscription();

    currentPage$ = new BehaviorSubject<number>(1);
    end: number;
    loading: boolean;
    loadingError: boolean;
    paginatedSearchResults$: Observable<Brewery[]>;
    perPage = 50;
    searchResults$: Observable<Brewery[] | undefined>;
    start: number;
    total: number;
    totalPages: number;
    queryParams: SearchCriteria;

    constructor(
        private breweriesSvc: BreweriesService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.getRouteParams();
        this.getBreweries();

        this.searchResults$ = this.breweriesSvc.searchResults$.pipe(
            filter(breweries => !!breweries),
            tap(breweries => this.total = breweries.length)
        );

        this.paginatedSearchResults$ = combineLatest([
            this.searchResults$.pipe(filter(breweries => !!breweries)),
            this.currentPage$
        ]).pipe(
            map(([breweries, currentPage]) => {
                const start = (currentPage - 1) * this.perPage;
                const end = start + this.perPage;

                this.start = start + 1;
                this.end = Math.min(end, this.total);
                this.totalPages = Math.ceil(this.total / this.perPage);

                return breweries.slice(start, end);
            })
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    private getRouteParams(): void {
        const subscription = this.route.queryParams.pipe(
            tap(queryParams => {
                this.queryParams = queryParams;
                this.breweriesSvc.changeSearchCriteria(this.queryParams);
            })
        ).subscribe();

        this.subscription.add(subscription);
    }

    getBreweries() {
        this.loading = true;
        this.loadingError = false;

        const subscription = this.breweriesSvc
            .getBreweries()
            .pipe(
                tap(() => {
                    this.loading = false;
                    this.breweriesSvc.changeSearchCriteria(this.queryParams);
                }),
                catchError(error => {
                    this.loading = false;
                    this.loadingError = true;
                    return throwError(() => new Error(error.message));
                })
            )
            .subscribe();

        this.subscription.add(subscription);
    }

    nextPage() {
        this.currentPage$.next(this.currentPage$.getValue() + 1);
    }

    previousPage() {
        if (this.currentPage$.getValue() > 1) {
            this.currentPage$.next(this.currentPage$.getValue() - 1);
        }
    }

}
