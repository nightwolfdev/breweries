import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'min'
})
export class MinPipe implements PipeTransform {

    transform(value: unknown, ...args: unknown[]): number | null {
        if (!Array.isArray(value) || value.length === 0) {
            return null;
        }

        return Math.min(...value);
    }

}
