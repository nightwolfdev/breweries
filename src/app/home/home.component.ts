import { Component } from '@angular/core';
import { ClrAlertModule } from '@clr/angular';

import { LoadingComponent, SearchFormComponent } from '../shared/components';
import { BreweriesDirective } from '../shared/directives';

@Component({
    selector: 'brew-home',
    imports: [ClrAlertModule, LoadingComponent, SearchFormComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent extends BreweriesDirective { }