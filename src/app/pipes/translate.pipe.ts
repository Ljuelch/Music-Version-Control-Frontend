import { Pipe, PipeTransform } from '@angular/core';
import { TranslationParam as TranslationParamInterface } from '../interfaces/translationParam.interface';
import { TranslationService } from '../services/translation.service';

@Pipe({
	name: 'translate',
	pure: false,
})
export class TranslatePipe implements PipeTransform {
	constructor(private readonly translationService: TranslationService) {}

	transform(value: string, params: TranslationParamInterface = {}): string {
		return this.translationService.getTranslation(value, params);
	}
}
