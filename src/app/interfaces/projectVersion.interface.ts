import { VersionFile as VersionFileInterface } from './versionFile.interface';

export interface ProjectVersion {
	id?: number;
	versionNumber: number;
	timestamp: string;
	date: Date;
	songBPM?: number;
	songKey?: string;
	waveformURL?: string | null;
	files: VersionFileInterface[];
}
