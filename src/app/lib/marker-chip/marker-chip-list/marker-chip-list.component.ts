import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MarkerListMarkerClick as MarkerListMarkerClickInterface } from '../../../interfaces/action/markerListMarkerClick.interface';
import { MarkerListAction as MarkerListActionInterface } from '../../../interfaces/markerListAction.interface';
import { MarkerListMarker as MarkerListMarkerInterface } from '../../../interfaces/markerListMarker.interface';

@Component({
	selector: 'app-marker-chip-list',
	templateUrl: './marker-chip-list.component.html',
	styleUrls: ['./marker-chip-list.component.scss'],
})
export class MarkerChipListComponent implements OnChanges {
	@Input() marker: MarkerListMarkerInterface[] = [];
	@Input() actions: MarkerListActionInterface[] = [];

	@Input() minWrap: number = 3;
	@Input() disabled: boolean = false;
	@Input() markerDisabled: boolean = false;
	@Input() mutliSelect: boolean = true;

	@ViewChild('markerDropdownTrigger') private markerDropdownTrigger?: MatMenuTrigger;

	@Output() readonly click$ = new EventEmitter<MarkerListMarkerInterface>();
	@Output() readonly actionClick$ = new EventEmitter<MarkerListMarkerClickInterface>();

	selectedMarker?: MarkerListMarkerInterface;
	protected readonly checkedMarker: MarkerListMarkerInterface[] = [];

	protected get anyMarkerUser(): boolean {
		return this.marker.some((marker) => marker.user);
	}

	protected get anyMarkerText(): boolean {
		return this.marker.some((marker) => marker.text?.trim());
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['marker'] || changes['selectedMarker']) {
			if (this.marker.length && !this.selectedMarker) this.selectedMarker = this.marker[0];
			this.cleanupCheckedMarker();
		}
		if (changes['disabled'] && this.disabled) this.closeMarkerDropdown();
	}

	public closeMarkerDropdown() {
		this.markerDropdownTrigger?.closeMenu();
	}

	protected markerClick(marker: MarkerListMarkerInterface) {
		this.selectedMarker = marker;
		this.click$.emit(marker);
	}

	protected actionClick(marker: MarkerListMarkerInterface[], action: MarkerListActionInterface) {
		this.actionClick$.emit({ marker, action });
	}

	protected colorActionClick(marker: MarkerListMarkerInterface, action: MarkerListActionInterface, color: string) {
		color = color.replace('#', '');
		if (color !== marker.color) {
			marker.color = color;
			this.actionClick([marker], action);
		}
	}

	public selectMarker(marker?: MarkerListMarkerInterface) {
		this.selectedMarker = marker;
		this.cleanupCheckedMarker();
	}

	private cleanupCheckedMarker() {
		for (const marker of this.checkedMarker) if (!this.marker.includes(marker)) this.uncheckMarker(marker);
	}

	protected markerChecked(marker: MarkerListMarkerInterface): boolean {
		return this.checkedMarker.includes(marker);
	}

	protected toggleMarkerChecked(marker: MarkerListMarkerInterface) {
		if (!this.checkMarker(marker)) this.uncheckMarker(marker);
	}

	protected checkMarker(marker: MarkerListMarkerInterface): boolean {
		if (this.markerChecked(marker)) return false;
		this.checkedMarker.push(marker);
		return true;
	}

	protected uncheckMarker(marker: MarkerListMarkerInterface): boolean {
		if (!this.markerChecked(marker)) return false;
		this.checkedMarker.splice(this.checkedMarker.indexOf(marker), 1);
		return true;
	}

	protected get allMarkerChecked(): boolean {
		return this.checkedMarker.length >= this.marker.length;
	}

	protected toggleAllMarkerChecked() {
		if (this.allMarkerChecked) this.uncheckAllMarker();
		else this.checkAllMarker();
	}

	protected checkAllMarker() {
		for (const marker of this.marker) this.checkMarker(marker);
	}

	protected uncheckAllMarker() {
		for (const marker of this.marker) this.uncheckMarker(marker);
	}
}
