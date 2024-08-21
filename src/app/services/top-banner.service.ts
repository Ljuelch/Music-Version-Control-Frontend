import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EmptyTopBanner as EmptyTopBannerInterface } from '../interfaces/abstract/emptyTopBanner.interface';
import { TopBannerOnDoneData as TopBannerOnDoneDataInterface } from '../interfaces/action/topBannerOnDoneData.interface';
import { TopBanner as TopBannerInterface } from '../interfaces/topBanner.interface';

@Injectable({
	providedIn: 'root',
})
export class TopBannerService {
	private readonly bannersSubject = new BehaviorSubject<TopBannerInterface[]>([]);
	readonly banners$ = this.bannersSubject.asObservable();

	readonly bannerDone$ = new EventEmitter<TopBannerOnDoneDataInterface>();

	private get randomId(): number {
		return new Date().getTime();
	}

	private getBannerId(banner: number | { id: number } | TopBannerInterface): number {
		return typeof banner === 'number' ? banner : banner.id;
	}

	addBanner(banner: EmptyTopBannerInterface): TopBannerInterface {
		const newBanner = {
			...banner,
			id: banner.id === undefined ? this.randomId : banner.id,
		} as TopBannerInterface;
		this.bannersSubject.next([...this.bannersSubject.value, newBanner]);
		return newBanner;
	}

	doneBanner(banner: number | { id: number } | TopBannerInterface) {
		const id = this.getBannerId(banner),
			thisBanner = this.bannersSubject.value.find((banner) => banner.id === id);
		if (thisBanner?.onDoneData) this.bannerDone$.emit(thisBanner.onDoneData);
	}

	removeBanner(banner: number | { id: number } | TopBannerInterface) {
		const id = this.getBannerId(banner);
		this.bannersSubject.next(this.bannersSubject.value.filter((banner) => banner.id !== id));
	}
}
