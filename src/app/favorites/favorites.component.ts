import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ClrAlertModule } from '@clr/angular';

import { Observable } from 'rxjs';

import { BreweryComponent, LoadingComponent } from '../shared/components';
import { BreweriesDirective } from '../shared/directives';
import { Brewery } from '../shared/interfaces';
import { BreweriesService } from '../shared/services';

@Component({
    selector: 'brew-favorites',
    imports: [BreweryComponent, ClrAlertModule, CommonModule, LoadingComponent],
    templateUrl: './favorites.component.html',
    styleUrl: './favorites.component.scss'
})
export class FavoritesComponent extends BreweriesDirective implements OnInit {

    favorites$: Observable<Brewery[]>;

    constructor(breweriesSvc: BreweriesService) {
        super(breweriesSvc);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.favorites$ = this.breweriesSvc.favorites$;
    }

}