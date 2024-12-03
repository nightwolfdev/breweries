import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, EMPTY, Observable, of } from 'rxjs';
import { distinct, expand, filter, map, mergeMap, reduce, switchMap, take, tap, toArray } from 'rxjs/operators';

import { Brewery, SearchCriteria, TypeDescription } from '../interfaces';

@Injectable({
    providedIn: 'root',
})
export class BreweriesService {
    private baseApi = 'https://api.openbrewerydb.org/v1/breweries';
    private breweries = new BehaviorSubject<Brewery[] | null>(null);
    private breweries$ = this.breweries.asObservable();
    private localStorageFavorites: string[];
    private localStorageKey = 'brewery-favorites';
    private perPage = 200;
    private searchCriteria = new BehaviorSubject<SearchCriteria | null>(null);
    private selectedState = new BehaviorSubject<string | null>(null);

    citiesByState$ = this.selectedState.pipe(
        filter(selectedState => !!selectedState), // Ignore null value
        switchMap(selectedState => this.breweries$.pipe(
            filter(breweries => !!breweries), // Ignore null value
            take(1), // Complete the observable
            mergeMap(breweries => breweries), // Return individual entries instead of the array
            map(brewery => ({ city: brewery.city?.trim()?.toLowerCase(), state: brewery.state?.trim()?.toLowerCase() })),
            filter(entry => entry.state === selectedState?.toLowerCase()), // Find matching entries based on state
            distinct(entry => entry.city), // Get unique entries based on city
            reduce((acc, current) => acc.concat(current), [] as { city: string, state: string }[]), // Build array of entries
            map(entries => entries.sort((a, b) => a.city.localeCompare(b.city))) // Sorty by city
        ))
    );

    favorites$ = this.breweries$.pipe(
        tap(() => {
            const favoritesStr = localStorage.getItem(this.localStorageKey);
            const favorites: string[] = favoritesStr ? JSON.parse(favoritesStr) : [];
            this.localStorageFavorites = favorites;
        }),
        filter(breweries => !!breweries), // Ignore null value
        // take, mergeMap, and toArray were not used because we want to keep observable alive in case user removes a favorite
        map(breweries => breweries.filter(brewery => this.localStorageFavorites.includes(brewery.id)))
    );

    searchResults$ = this.searchCriteria.asObservable().pipe(
        switchMap(searchCriteria => {
            if (searchCriteria?.dist) {
                return this.getBreweriesNearMe(searchCriteria.dist);
            } else {
                return this.breweries$.pipe(
                    filter(breweries => !!breweries), // Ignore null value
                    take(1), // Complete the observable
                    map(breweries => breweries.filter(
                        brewery => Object.entries(searchCriteria as SearchCriteria).filter(([_, value]) => value).every(
                            ([key, value]) => {
                                if (key === 'name') {
                                    return brewery[key].toLowerCase().includes(value.toLowerCase());
                                }
                                return brewery[key as keyof Brewery] === value;
                            }
                        ))
                    )
                )
            }
        })
    );

    states$ = this.breweries$.pipe(
        filter(breweries => !!breweries), // Ignore null value
        take(1), // Complete the obserable
        mergeMap(breweries => breweries), // Return individual entries instead of the array
        map(brewery => brewery.state?.trim()?.toLowerCase()),
        distinct(), // Get unique states
        toArray(), // Create an array from individual entries. Observable must complete in order to use this
        map(states => states.sort())
    );

    types$ = this.breweries$.pipe(
        filter(breweries => !!breweries), // Ignore null value
        take(1), // Complete the observable
        mergeMap(breweries => breweries), // Return individual entries instead of the array
        map(brewery => brewery.brewery_type?.trim()?.toLowerCase()),
        distinct(), // Get unique types
        toArray(), // Create an array from individual entries. Observable must complete in order to use this
        map(types => types.sort())
    );

    readonly TYPE_DESCRIPTIONS: TypeDescription[] = [
        {
            description: 'A beer-focused restaurant or restaurant/bar with a brewery on-premise.',
            id: 'brewpub',
        },
        {
            description: "A brewery that uses another brewery's equipment.",
            id: 'contract',
        },
        {
            description: 'Most craft breweries.',
            id: 'micro',
        },
        {
            description: 'An extremely small brewery which typically only distributes locally.',
            id: 'nano',
        },
        {
            description: 'A brewery in planning or not yet opened to the public.',
            id: 'planning',
        },
        {
            description: 'Similar to contract brewing but refers more to a brewery incubator.',
            id: 'propriator',
        },
        {
            description: 'A regional location of an expanded brewery.',
            id: 'regional',
        },
    ];

    constructor(private httpSvc: HttpClient) { }

    private getData(page: number): Observable<Brewery[]> {
        return this.httpSvc.get<Brewery[]>(`${this.baseApi}?by_country=United+States&page=${page}&per_page=${this.perPage}`);
    }

    private buildFavorites(breweries: Brewery[]) {
        const favoritesStr = localStorage.getItem(this.localStorageKey);
        const favorites = favoritesStr ? JSON.parse(favoritesStr) : [];

        return breweries.map(brewery => {
            brewery.favorite = favorites.includes(brewery.id);
            return brewery;
        });
    }

    changeSearchCriteria(criteria: SearchCriteria) {
        this.searchCriteria.next(criteria);
    }

    changeSelectedState(state: string) {
        this.selectedState.next(state);
    }

    getCurrentSearchCriteria(): SearchCriteria | null {
        return this.searchCriteria.getValue();
    }

    getBreweries(): Observable<Brewery[]> {
        const breweries = this.breweries.getValue();
        let page = 1;

        // If we already got breweries, don't make request again
        if (breweries) {
            return of(breweries);
        }

        return this.getData(page).pipe(
            expand(response => {
                if (response.length === this.perPage) {
                    page = page + 1;
                    return this.getData(page);
                }

                return EMPTY;
            }), // Get all paginated data
            reduce((acc, current) => acc.concat(current), [] as Brewery[]), // Build array of breweries
            map(breweries => this.buildFavorites(breweries)), // Add in favorite property based on favorites
            tap(breweries => this.breweries.next(breweries)) // Emit breweries to observable
        );
    }

    getBreweriesNearMe(coordinates: string): Observable<Brewery[]> {
        return this.httpSvc.get<Brewery[]>(`${this.baseApi}?by_dist=${coordinates}&per_page=${this.perPage}`).pipe(
            map(breweries => this.buildFavorites(breweries)) // Add in favorites property based on favorites
        );
    }

    updateFavorite(brewery: Brewery) {
        const breweries = (this.breweries.getValue() as Brewery[]).map(b => {
            if (brewery.id === b.id) {
                const favoritesStr = localStorage.getItem(this.localStorageKey);
                let favorites: string[] = favoritesStr ? JSON.parse(favoritesStr) : [];

                if (brewery.favorite) {
                    favorites.push(brewery.id);
                } else {
                    favorites = favorites.filter(favorite => favorite !== brewery.id);
                }

                localStorage.setItem(this.localStorageKey, JSON.stringify(favorites));

                return { ...brewery };
            }

            return b;
        });

        this.breweries.next(breweries);
    }
}
