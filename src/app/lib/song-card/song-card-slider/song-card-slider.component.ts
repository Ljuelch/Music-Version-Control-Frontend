import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	Output,
	ViewChild,
} from '@angular/core';
import { Project as ProjectInterface } from '../../../interfaces/project.interface';

@Component({
	selector: 'app-song-card-slider',
	templateUrl: './song-card-slider.component.html',
	styleUrls: ['./song-card-slider.component.scss'],
})
export class SongCardSliderComponent implements AfterViewInit {
	@ViewChild('projectBoxesScollContainer') projectBoxesScollContainer?: ElementRef<HTMLElement>;
	@ViewChild('projectBoxesContainer') projectBoxesContainer?: ElementRef<HTMLElement>;

	@Input() projects!: ProjectInterface[];

	@Input() scrollAmount?: number;
	@Input() showEmpty: boolean = true;
	@Input() loading: boolean = false;

	@Output() emptyClick = new EventEmitter<void>();

	constructor(private readonly cdr: ChangeDetectorRef) {}

	@HostListener('window:resize')
	detectChanges() {
		this.cdr.detectChanges();
	}

	ngAfterViewInit() {
		this.detectChanges();
	}

	private get scrollAmountCalc(): number {
		return this.scrollAmount !== undefined
			? this.scrollAmount
			: this.projectBoxesContainer
			? this.projectBoxesContainer.nativeElement.offsetWidth / this.projects.length + 4
			: 0;
	}

	protected get leftScrollable(): boolean {
		return !!(this.projectBoxesScollContainer && this.projectBoxesScollContainer.nativeElement.scrollLeft > 0);
	}

	protected get rightScrollable(): boolean {
		return !!(
			this.projectBoxesContainer &&
			this.projectBoxesScollContainer &&
			this.projectBoxesContainer.nativeElement.offsetWidth >
				this.projectBoxesScollContainer?.nativeElement.offsetWidth &&
			this.projectBoxesScollContainer.nativeElement.scrollLeft +
				this.projectBoxesScollContainer.nativeElement.offsetWidth -
				24 <
				this.projectBoxesContainer.nativeElement.offsetWidth
		);
	}

	scrollLeft() {
		if (this.projectBoxesScollContainer)
			this.projectBoxesScollContainer.nativeElement.scrollLeft -= this.scrollAmountCalc;
	}

	scrollRight() {
		if (this.projectBoxesScollContainer)
			this.projectBoxesScollContainer.nativeElement.scrollLeft += this.scrollAmountCalc;
	}
}
