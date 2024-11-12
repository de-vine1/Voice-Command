import { Component } from '@angular/core';

@Component({
  selector: 'app-track-info',
  standalone: true,
  templateUrl: './track-info.component.html',
  styleUrls: ['./track-info.component.css'],
})
export class TrackInfoComponent {
  trackName = 'Asake - Dull';
  albumArt = 'assets/images/default.jpg';
}
