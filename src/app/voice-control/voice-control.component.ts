import { Component } from '@angular/core';

@Component({
  selector: 'app-voice-control',
  standalone: true,
  templateUrl: './voice-control.component.html',
  styleUrls: ['./voice-control.component.css'],
})
export class VoiceControlComponent {
  isListening = false;

  toggleListening() {
    this.isListening = !this.isListening;
    if (this.isListening) {
      console.log('Listening for voice commands...');
    } else {
      console.log('Stopped listening.');
    }
  }
}
