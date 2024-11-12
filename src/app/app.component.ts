import { Component } from '@angular/core';
import { TrackInfoComponent } from './track-info/track-info.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { VolumeControlComponent } from './volume-control/volume-control.component';
import { VoiceControlComponent } from './voice-control/voice-control.component';
import { MusicPlayerComponent } from './music-player/music-player.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    TrackInfoComponent,
    ProgressBarComponent,
    VolumeControlComponent,
    VoiceControlComponent,
    MusicPlayerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}
