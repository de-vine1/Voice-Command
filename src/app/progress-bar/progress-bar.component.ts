import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css'],
})
export class ProgressBarComponent {
  @Input() currentTime: string = '0:00';
  @Input() duration: string = '0:00';
  @Input() progressValue: number = 0;
}
