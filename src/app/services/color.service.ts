import { Injectable } from '@angular/core';
import { randomColor } from '../shared/color';

@Injectable({
	providedIn: 'root',
})
export class ColorService {
	getNextColor(color: string = ''): string {
		return randomColor[randomColor.indexOf(color) + 1] || randomColor[0];
	}
}
