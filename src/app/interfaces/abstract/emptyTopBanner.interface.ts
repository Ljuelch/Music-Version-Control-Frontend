import { TopBannerOnDoneData as TopBannerOnDoneDataInterface } from '../action/topBannerOnDoneData.interface';

export interface EmptyTopBanner {
	id?: number;
	icon?: string;
	title: string;
	text?: string;
	progress?: null | number;
	action?: (banner: EmptyTopBanner) => void;
	actionText?: string;
	onDoneData?: TopBannerOnDoneDataInterface;
}
