import { Component } from '@angular/core';
import { MusicService } from '../services/music-service.service'; // Make sure this import is correct

@Component({
  selector: 'app-music-player',
  standalone: true,
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css'],
})
export class MusicPlayerComponent {
  musicFiles: string[] = [];
  currentTrackIndex: number = 0;
  isShuffling: boolean = false;
  isLooping: boolean = false;

  constructor(private musicService: MusicService) {
    // Get music files from the MusicService
    this.musicFiles = this.musicService.musicFiles;
    // Optionally, set the initial track
    this.musicService.setTrack(this.currentTrackIndex);
  }

  // Use MusicService methods to control playback
  playMusic() {
    this.musicService.playMusic().catch((error) => {
      console.error('Error playing audio:', error);
      alert('There was an issue playing the music file.');
    });
  }

  pauseMusic() {
    this.musicService.pauseMusic();
  }

  nextTrack() {
    this.musicService.nextTrack();
  }

  previousTrack() {
    this.musicService.previousTrack();
  }

  toggleShuffle() {
    this.isShuffling = !this.isShuffling;
    this.musicService.toggleShuffle();
  }

  toggleLoop() {
    this.isLooping = !this.isLooping;
    this.musicService.toggleLoop();
  }

  adjustVolume(direction: number) {
    this.musicService.adjustVolume(direction);
  }
}
