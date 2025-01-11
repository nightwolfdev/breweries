import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClrProgressBarModule } from '@clr/angular';

import { Subscription } from 'rxjs';

import { BreweriesService } from '../../services';

@Component({
    selector: 'brew-loading',
    imports: [CommonModule, ClrProgressBarModule],
    templateUrl: './loading.component.html',
    styleUrl: './loading.component.scss'
})
export class LoadingComponent implements OnDestroy, OnInit {
    private subscription = new Subscription();
    loadingProgress: number;

    constructor(private breweriesSvc: BreweriesService) { }

    ngOnInit() {
        const subscription = this.breweriesSvc.loadingProgress$.subscribe(loadingProgress => this.loadingProgress = loadingProgress);
        this.subscription.add(subscription);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}