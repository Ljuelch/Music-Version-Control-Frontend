import {
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { SeekbarSeekEvent as SeekbarSeekEventInterface } from '../../../interfaces/action/seekbarSeekEvent.interface';

@Component({
	selector: 'app-seekbar',
	templateUrl: './seekbar.component.html',
	styleUrls: ['./seekbar.component.scss'],
})
export class SeekbarComponent implements OnChanges {
	@ViewChild('seekbar') private seekbar?: ElementRef<HTMLInputElement>;

	@Input() min: number = 0;
	@Input() max: number = 100;
	@Input() step: number = 1;
	@Input() value: number | null = null;

	@Output() readonly onSeek = new EventEmitter<SeekbarSeekEventInterface>();

	private dragging: boolean = false;

	constructor(private readonly cdr: ChangeDetectorRef) {}

	private getSeekValueWithFallback(event: MouseEvent | TouchEvent): number {
		const target = this.seekbar?.nativeElement as HTMLElement,
			rect = target?.getBoundingClientRect(),
			clientX =
				event instanceof TouchEvent
					? event.touches.length
						? event.touches[0].clientX
						: event.changedTouches[0].clientX
					: event.clientX,
			offsetX = event instanceof TouchEvent ? clientX - rect.left : event.offsetX;

		return !rect || clientX <= rect.left
			? 0
			: clientX >= rect.left + target.clientWidth
			? this.max
			: target.clientWidth
			? (offsetX / target.clientWidth) * this.max
			: this.valueWithFallback;
	}

	private get valueWithFallback(): number {
		if (this.value === null) this.update();
		return this.value!;
	}

	protected get playheadWidthFactor(): number {
		return this.valueWithFallback / this.max;
	}

	protected get playheadWidthCSSValue(): string {
		return `calc(${this.playheadWidthFactor * 100}% + ${Math.round((1 - this.playheadWidthFactor) * 18)}px)`;
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['value'] && this.value === null) this.update();
	}

	update(value?: number) {
		if (value !== undefined && this.seekbar?.nativeElement) this.seekbar.nativeElement.value = value.toString();
		this.value = +this.seekbar!.nativeElement.value || 0;
		this.cdr.detectChanges();
	}

	protected onDown(event: MouseEvent | TouchEvent) {
		if (!this.dragging) {
			this.dragging = true;
			this.update();
			this.onSeek.emit({ time: this.getSeekValueWithFallback(event), type: 'down' });
		}
	}

	protected onMove(event: MouseEvent | TouchEvent) {
		if (this.dragging) {
			this.update();
			this.onSeek.emit({ time: this.getSeekValueWithFallback(event), type: 'move' });
		}
	}

	@HostListener('document:mouseup', ['$event'])
	@HostListener('document:touchend', ['$event'])
	@HostListener('document:touchcancel', ['$event'])
	protected onUp(event: MouseEvent | TouchEvent) {
		if (this.dragging) {
			this.dragging = false;
			this.seekbar?.nativeElement.blur();
			this.update();
			this.onSeek.emit({ time: this.getSeekValueWithFallback(event), type: 'up' });
		}
	}
}
