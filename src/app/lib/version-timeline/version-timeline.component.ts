import {
	Component,
	Input,
	Output,
	EventEmitter,
	AfterViewChecked,
	Renderer2,
	ViewChild,
	ElementRef,
} from '@angular/core';
import { ProjectVersion as ProjectVersionInterface } from '../../interfaces/projectVersion.interface';

@Component({
	selector: 'app-version-timeline',
	templateUrl: './version-timeline.component.html',
	styleUrls: ['./version-timeline.component.scss'],
})
export class VersionTimelineComponent implements AfterViewChecked {
	private prevVersionsValue: ProjectVersionInterface[] = [];
	@ViewChild('scrollContainer', { static: true }) protected scrollContainer!: ElementRef<HTMLElement>;

	@Input() versions: ProjectVersionInterface[] = [];
	@Input() selectedVersionNumber?: number;
	@Input() plusButtonDisabled: boolean = false;

	@Output() protected versionClick = new EventEmitter<number>();
	@Output() protected plusClick = new EventEmitter<void>();

	private get activeVersionElement(): HTMLElement | undefined {
		try {
			return this.renderer.selectRootElement('.version-timeline-version.active', true);
		} catch (_) {
			return undefined;
		}
	}

	constructor(private readonly renderer: Renderer2) {}

	ngAfterViewChecked() {
		const activeVersionElement = this.activeVersionElement;
		if (activeVersionElement && this.prevVersionsValue !== this.versions) {
			if (!this.prevVersionsValue.length && this.versions.length)
				this.scrollContainer.nativeElement.scrollLeft =
					activeVersionElement.getBoundingClientRect().left -
					window.innerWidth / 2 +
					this.scrollContainer.nativeElement.getBoundingClientRect().left +
					activeVersionElement.clientWidth / 2;
			this.prevVersionsValue = this.versions;
		}
	}

	protected plusClicked() {
		if (!this.plusButtonDisabled) this.plusClick.emit();
	}
}
