import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClrAlertModule } from '@clr/angular';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { BreweryComponent, LoadingComponent } from '../shared/components';
import { BreweriesDirective } from '../shared/directives';
import { Brewery, SearchCriteria } from '../shared/interfaces';
import { BreweriesService } from '../shared/services';

@Component({
    selector: 'brew-search',
    imports: [BreweryComponent, ClrAlertModule, CommonModule, LoadingComponent],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss',
})
export class SearchComponent extends BreweriesDirective implements OnDestroy, OnInit {

    currentPage$ = new BehaviorSubject<number>(1);
    end: number;
    paginatedSearchResults$: Observable<Brewery[]>;
    perPage = 50;
    searchResults$: Observable<Brewery[] | undefined>;
    start: number;
    total: number;
    totalPages: number;
    queryParams: SearchCriteria;

    constructor(
        breweriesSvc: BreweriesService,
        private route: ActivatedRoute
    ) {
        super(breweriesSvc);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.getRouteParams();

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

    private getRouteParams(): void {
        const subscription = this.route.queryParams.pipe(
            tap(queryParams => {
                this.queryParams = queryParams;
                this.breweriesSvc.changeSearchCriteria(this.queryParams);
            })
        ).subscribe();

        this.subscription.add(subscription);
    }

    nextPage(): void {
        this.currentPage$.next(this.currentPage$.getValue() + 1);
    }

    previousPage(): void {
        if (this.currentPage$.getValue() > 1) {
            this.currentPage$.next(this.currentPage$.getValue() - 1);
        }
    }

}