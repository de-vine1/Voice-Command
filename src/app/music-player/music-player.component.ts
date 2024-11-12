import { Component } from '@angular/core';
import { TrackInfoComponent } from '../track-info/track-info.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { VolumeControlComponent } from '../volume-control/volume-control.component';
import { VoiceControlComponent } from '../voice-control/voice-control.component';

@Component({
  selector: 'app-music-player',
  standalone: true,
  imports: [
    TrackInfoComponent,
    ProgressBarComponent,
    VolumeControlComponent,
    VoiceControlComponent,
  ],
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css'],
})
export class MusicPlayerComponent {
  isShuffling = false;
  isLooping = false;

  previousTrack() {
    console.log('Previous track');
  }
  nextTrack() {
    console.log('Next track');
  }
  toggleShuffle() {
    this.isShuffling = !this.isShuffling;
  }
  toggleLoop() {
    this.isLooping = !this.isLooping;
  }
}
