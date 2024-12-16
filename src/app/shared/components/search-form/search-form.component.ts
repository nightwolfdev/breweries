import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClrAlertModule, ClrInputModule, ClrLoadingModule, ClrModalModule, ClrSelectModule } from '@clr/angular';

import { Observable } from 'rxjs';

import { SearchCriteria, SearchForm } from '../../interfaces';
import { BreweriesService } from '../../services';

@Component({
    selector: 'brew-search-form',
    imports: [ClrAlertModule, ClrInputModule, ClrLoadingModule, ClrModalModule, ClrSelectModule, CommonModule, ReactiveFormsModule],
    templateUrl: './search-form.component.html',
    styleUrl: './search-form.component.scss',
})
export class SearchFormComponent implements OnInit {

    citiesByState$: Observable<{ city: string, state: string }[]>;
    form: FormGroup<SearchForm>;
    geoLocationError: boolean;
    geoLocationErrorMsg: string;
    states$: Observable<string[]>;
    types$: Observable<string[]>;

    constructor(
        private breweriesSvc: BreweriesService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.buildForm();
        this.citiesByState$ = this.breweriesSvc.citiesByState$;
        this.states$ = this.breweriesSvc.states$;
        this.types$ = this.breweriesSvc.types$;
    }

    private buildForm(): void {
        const searchCriteria = this.breweriesSvc.getCurrentSearchCriteria();

        this.form = new FormGroup({
            brewery_type: new FormControl(''),
            city: new FormControl(''),
            name: new FormControl(),
            state: new FormControl(''),
        });

        if (searchCriteria) {
            this.form.patchValue(searchCriteria);

            if (searchCriteria.state) {
                this.breweriesSvc.changeSelectedState(searchCriteria.state);
            }
        } else {
            this.form.get('city')?.disable();
        }
    }

    private getSearchCriteria(): SearchCriteria {
        const searchCriteria = this.form.value as SearchCriteria;

        for (const key in searchCriteria) {
            if (!searchCriteria[key as keyof typeof searchCriteria]) {
                delete searchCriteria[key as keyof typeof searchCriteria];
            }
        }

        return searchCriteria;
    }

    breweriesNearMe(): void {
        this.geoLocationError = false;
        this.geoLocationErrorMsg = '';

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                this.router.navigate(['/search'], { queryParams: { dist: `${latitude},${longitude}` } });
            }, error => {
                this.geoLocationError = true;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        this.geoLocationErrorMsg = 'You denied access to your location. If you wish to allow access, you can change the location permission for this website in your browser settings.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        this.geoLocationErrorMsg = 'Your location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        this.geoLocationErrorMsg = 'Finding your location took too long.';
                        break;
                }
            });
        } else {
            this.geoLocationError = true;
            this.geoLocationErrorMsg = 'Finding your location is not supported by your browser.';
        }
    }

    onChangeState(event: Event): void {
        const state = (event.target as HTMLSelectElement).value;
        const cityControl = this.form.get('city');

        if (state) {
            cityControl?.enable();
        } else {
            cityControl?.disable();
        }

        this.breweriesSvc.changeSelectedState(state);
    }

    onSubmit(): void {
        const queryParams = this.getSearchCriteria();
        this.router.navigate(['/search'], { queryParams });
    }
}
