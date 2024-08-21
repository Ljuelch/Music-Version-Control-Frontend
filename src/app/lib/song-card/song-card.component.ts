import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Project as ProjectInterface } from '../../interfaces/project.interface';
import { ProjectService } from '../../services/project.service';

@Component({
	selector: 'app-song-card',
	templateUrl: './song-card.component.html',
	styleUrls: ['./song-card.component.scss'],
})
export class SongCardComponent {
	@Input() project!: ProjectInterface;
	@Input() empty: boolean = false;

	@Output() emptyClick = new EventEmitter<void>();

	constructor(protected readonly projectService: ProjectService) {}
}
