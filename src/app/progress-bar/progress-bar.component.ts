import { Component } from '@angular/core';
import { TimeFormatPipe } from '../time-format.pipe';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css'],
  imports: [TimeFormatPipe],
})
export class ProgressBarComponent {
  currentTime = 0;
  duration = 180;

  updateProgressBar(currentTime: number, duration: number) {
    this.currentTime = currentTime;
    this.duration = duration;
  }
}
