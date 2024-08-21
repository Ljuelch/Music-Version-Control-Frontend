import { EventEmitter, Injectable } from '@angular/core';

export type Status = 'stopped' | 'running' | 'stopping';
export type WasPlayingBefore = boolean;

@Injectable({
	providedIn: 'root',
})
export class GlobalAudioPlayerStutterService {
	private readonly DEFAULT_LOOP_TIMEOUT: number = 200; // 0.2s

	private _status: Status = 'stopped';
	private _wasPlayingBefore?: WasPlayingBefore;
	private _player?: HTMLAudioElement;

	private triggerLoopTimeout: number = this.DEFAULT_LOOP_TIMEOUT;
	currentTime: number = 0;

	readonly stutter$ = new EventEmitter<void>();
	readonly stopped$ = new EventEmitter<void>();

	get status(): Status {
		return this._status;
	}

	get stuttering(): boolean {
		return this._status !== 'stopped';
	}

	get wasPlayingBefore(): WasPlayingBefore | undefined {
		return this.stuttering ? this._wasPlayingBefore : undefined;
	}

	private get playerPlaying(): boolean {
		return !!(this._player && !this._player.paused);
	}

	setPlayer(player: HTMLAudioElement): this {
		this._player = player;
		return this;
	}

	start(wasPlayingBefore: WasPlayingBefore = this.playerPlaying): Status {
		if (this._status === 'stopped') {
			this._status = 'running';
			this._wasPlayingBefore = wasPlayingBefore;
			this.stutterLoop();
		}
		return this._status;
	}

	stop(): Promise<WasPlayingBefore | null> {
		return new Promise<WasPlayingBefore | null>((resolve) => {
			if (this._status === 'running') {
				this.stopped$.subscribe(() => {
					const wasPlayingBefore: WasPlayingBefore = this._wasPlayingBefore!;
					this._wasPlayingBefore = undefined;
					if (wasPlayingBefore) void this._player?.play();
					resolve(wasPlayingBefore);
				});
				this.checkStop(true);
			} else resolve(null);
		});
	}

	private stutterLoop() {
		if (this._player) {
			this._player.pause();
			this._player.currentTime = this.currentTime;

			if (!this.checkStopAndClear() && this.currentTime < this._player.duration) {
				this.stutter$.emit();
				void this._player.play();
				setTimeout(() => this.stutterLoop(), this.triggerLoopTimeout);
			}
		} else {
			this.stop().then();
			setTimeout(() => {
				this.checkStopAndClear(true);
			}, this.triggerLoopTimeout);
		}
	}

	private checkStop(force: boolean = false): boolean {
		if (force) this._status = 'stopping';
		return this._status !== 'running';
	}

	private checkStopAndClear(force: boolean = false): boolean {
		if (this.checkStop(force)) {
			this._status = 'stopped';
			this.stopped$.emit();
			return true;
		}
		return false;
	}
}
