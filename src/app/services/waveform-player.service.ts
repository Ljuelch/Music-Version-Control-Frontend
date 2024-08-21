import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getApiUrl } from '../../config';
import { AudioFileUrl as AudioFileUrlInterface } from '../interfaces/api/audioFileUrl.interface';

@Injectable({
	providedIn: 'root',
})
export class WaveformPlayerService {
	constructor(private readonly http: HttpClient) {}

	getWaveform(hash: string): Promise<Blob | string | null> {
		return new Promise((resolve) => {
			this.http
				.get(getApiUrl.apiUrl + '/project/version/file/audio/waveformData/' + hash, {
					responseType: 'blob',
					withCredentials: true,
				})
				.subscribe(
					async (response: Blob) => resolve(response.type === 'text/html' ? await response.text() : response),
					() => resolve(null),
				);
		});
	}

	async getWaveformURL(hash: string): Promise<string> {
		const waveform = await this.getWaveform(hash);
		return waveform
			? waveform instanceof Blob
				? (window.URL || window.webkitURL).createObjectURL(waveform)
				: waveform
			: '';
	}

	getAudioURL(type: string, hash: string): Observable<AudioFileUrlInterface> {
		return this.http.get<AudioFileUrlInterface>(`${getApiUrl.apiUrl}/project/version/file/audio/url/${type}/${hash}`, {
			withCredentials: true,
		});
	}
}
