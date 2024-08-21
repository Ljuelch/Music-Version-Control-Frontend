import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Translation as TranslationInterface } from '../interfaces/translation.interface';
import { TranslationParam as TranslationParamInterface } from '../interfaces/translationParam.interface';
import { noCache } from '../shared/headers';

@Injectable({
	providedIn: 'root',
})
export class TranslationService {
	readonly PATH = '/assets/i18n';
	readonly KEY_SEPERATOR = '.';
	readonly PARAM_PREFIX = '%';

	private translations: TranslationInterface = {};
	private currentLanguage: string = 'en';

	private languageChangeSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this.currentLanguage);
	//languageChange$ = this.languageChangeSubject.asObservable();

	constructor(private readonly http: HttpClient) {}

	private replaceParam(translation: string, key: string, value?: string) {
		return value ? translation.replaceAll(this.PARAM_PREFIX + key + this.PARAM_PREFIX, value) : translation;
	}

	private replaceParams(translation: string, params: TranslationParamInterface) {
		for (const key in params) translation = this.replaceParam(translation, key, params[key]);
		return translation;
	}

	loadTranslations(): Promise<void> {
		return new Promise((resolve) => {
			this.http
				.get(`${this.PATH}/${this.currentLanguage}.json`, {
					headers: new HttpHeaders(noCache),
				})
				.subscribe((translations: TranslationInterface | object) => {
					this.translations = translations as TranslationInterface;
					resolve();
				});
		});
	}

	getTranslation(keys: string | string[], params: TranslationParamInterface = {}): string {
		let translations: TranslationInterface | string = this.translations;
		for (const key of typeof keys === 'string' ? keys.split(this.KEY_SEPERATOR) : keys) {
			translations = translations[key];
			if (typeof translations === 'string') break;
		}
		return this.replaceParams(translations as string, params);
	}

	async changeLanguage(lang: string): Promise<void> {
		this.currentLanguage = lang;
		await this.loadTranslations();
		this.languageChangeSubject.next(this.currentLanguage);
	}
}
