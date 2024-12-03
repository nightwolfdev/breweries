import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import '@cds/core/icon/register.js';
import { ClarityIcons, starIcon } from '@cds/core/icon';

import { Brewery } from '../../interfaces';
import { BreweriesService } from '../../services';

@Component({
    selector: 'brew-brewery',
    imports: [],
    templateUrl: './brewery.component.html',
    styleUrl: './brewery.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BreweryComponent {
    @Input() brewery: Brewery;

    constructor(private breweriesSvc: BreweriesService) {
        ClarityIcons.addIcons(starIcon);
    }

    toggleFavorite(brewery: Brewery) {
        brewery.favorite = !brewery.favorite;
        this.breweriesSvc.updateFavorite(brewery);
    }
}