import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ClrProgressBarModule } from '@clr/angular';

import { Observable } from 'rxjs';

import { BreweriesService } from '../../services';

@Component({
    selector: 'brew-loading',
    imports: [CommonModule, ClrProgressBarModule],
    templateUrl: './loading.component.html',
    styleUrl: './loading.component.scss'
})
export class LoadingComponent implements OnInit {
    loadingProgress$: Observable<number>;

    constructor(private breweriesSvc: BreweriesService) { }

    ngOnInit() {
        this.loadingProgress$ = this.breweriesSvc.loadingProgress$;
    }
}