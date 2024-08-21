import { EmptyTopBanner as EmptyTopBannerInterface } from './abstract/emptyTopBanner.interface';

export interface TopBanner extends EmptyTopBannerInterface {
	id: number;
	action?: (banner: EmptyTopBannerInterface | TopBanner) => void;
}
