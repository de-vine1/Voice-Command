import { Component } from '@angular/core';

@Component({
  selector: 'app-volume-control',
  standalone: true,
  templateUrl: './volume-control.component.html',
  styleUrls: ['./volume-control.component.css'],
})
export class VolumeControlComponent {
  audio = new Audio();

  changeVolume(amount: number) {
    this.audio.volume = Math.min(Math.max(this.audio.volume + amount, 0), 1);
  }
}
