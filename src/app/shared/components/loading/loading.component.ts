import { Component, Input } from '@angular/core';
import { ClrSpinnerModule } from '@clr/angular';

@Component({
    selector: 'brew-loading',
    imports: [ClrSpinnerModule],
    templateUrl: './loading.component.html',
    styleUrl: './loading.component.scss'
})
export class LoadingComponent {
    @Input() text: string;
}