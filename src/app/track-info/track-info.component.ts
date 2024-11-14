import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-track-info',
  standalone: true,
  templateUrl: './track-info.component.html',
  styleUrls: ['./track-info.component.css'],
})
export class TrackInfoComponent {
  @Input() trackName: string = '';
}
