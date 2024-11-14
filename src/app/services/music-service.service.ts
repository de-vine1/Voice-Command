import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private audio: HTMLAudioElement = new Audio();
  private currentTrackIndex = 0;
  private isShuffling = false;
  private isLooping = false;

  musicFiles: string[] = [
    'assets/music/Asake - Dull.mp3',
    'assets/music/Asake - Dupe.mp3',
    'assets/music/Asake - Joha.mp3',
    'assets/music/Asake - Muse.mp3',
    'assets/music/Asake - Nzaza.mp3',
    'assets/music/Asake - Organise.mp3',
    'assets/music/Asake - Ototo.mp3',
    'assets/music/Asake - Sunmomi.mp3',
    'assets/music/Asake ft. Russ - Reason.mp3',
    'assets/music/Asake_-_Peace_Be_Unto_You.mp3',
    'assets/music/Asake-Terminator (1).mp3',
    'assets/music/Asake-Terminator.mp3',
  ];

  constructor() {
    this.audio.addEventListener('ended', () => {
      if (!this.isLooping) {
        this.nextTrack();
      }
    });
  }

  setTrack(index: number) {
    this.currentTrackIndex = index;
    this.audio.src = this.musicFiles[this.currentTrackIndex];
    this.audio.load();
  }

  playMusic() {
    this.setTrack(this.currentTrackIndex);
    return this.audio.play();
  }

  pauseMusic() {
    this.audio.pause();
  }

  nextTrack() {
    if (this.isShuffling) {
      this.currentTrackIndex = Math.floor(
        Math.random() * this.musicFiles.length
      );
    } else {
      this.currentTrackIndex =
        (this.currentTrackIndex + 1) % this.musicFiles.length;
    }
    this.playMusic();
  }

  previousTrack() {
    this.currentTrackIndex =
      (this.currentTrackIndex - 1 + this.musicFiles.length) %
      this.musicFiles.length;
    this.playMusic();
  }

  toggleShuffle() {
    this.isShuffling = !this.isShuffling;
  }

  toggleLoop() {
    this.isLooping = !this.isLooping;
    this.audio.loop = this.isLooping;
  }

  adjustVolume(direction: number) {
    let newVolume = this.audio.volume + direction * 0.1;
    this.audio.volume = Math.min(Math.max(newVolume, 0), 1);
  }
}
