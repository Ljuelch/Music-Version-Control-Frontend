import { EventEmitter, Injectable } from '@angular/core';
import { MarkerListMarker as MarkerListMarkerInterface } from '../interfaces/markerListMarker.interface';
import { ColorService } from './color.service';

@Injectable({
	providedIn: 'root',
})
export class WaveformPlayerMarkerService {
	private _marker: MarkerListMarkerInterface[] = [];

	readonly change$ = new EventEmitter<void>();

	constructor(private readonly colorService: ColorService) {}

	private trimTime(time: number): number {
		return parseFloat(time.toFixed(1));
	}

	get marker(): MarkerListMarkerInterface[] {
		return this._marker;
	}

	getMarker(versionId: number): MarkerListMarkerInterface[] {
		return this._marker.filter((marker) => marker.versionId === versionId);
	}

	getMarkerById(markerId: string): MarkerListMarkerInterface | undefined {
		return this._marker.find((marker) => marker.id === markerId);
	}

	addMarker(versionId: number, start: number): MarkerListMarkerInterface {
		const lastMarker = this.getMarker(versionId)?.reverse()[0];
		const marker = {
			id: Date.now().toString(),
			versionId,
			color: this.colorService.getNextColor(lastMarker?.color),
			start: this.trimTime(start),
		} as MarkerListMarkerInterface;
		this._marker.push(marker);
		this.change$.emit();
		return marker;
	}

	removeMarker(marker: MarkerListMarkerInterface | string) {
		const markerId = typeof marker === 'string' ? marker : marker.id,
			_marker = this._marker.filter((_marker) => _marker.id !== markerId);
		if (this._marker.length !== _marker.length) this.change$.emit();
		this._marker = _marker;
	}
}
