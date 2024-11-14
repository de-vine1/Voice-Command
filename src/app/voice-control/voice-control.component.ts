import { Component } from '@angular/core';
import { MusicService } from '../services/music-service.service'; // Correct import path

@Component({
  selector: 'app-voice-control',
  standalone: true,
  templateUrl: './voice-control.component.html',
  styleUrls: ['./voice-control.component.css'],
})
export class VoiceControlComponent {
  recognition: any;
  isListening = false;

  constructor(private musicService: MusicService) {
    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'en-US';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      this.handleCommand(command);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
    };
  }

  toggleListening() {
    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  startListening() {
    this.recognition.start();
    this.isListening = true;
  }

  stopListening() {
    this.recognition.stop();
    this.isListening = false;
  }

  handleCommand(command: string) {
    this.stopListening();

    if (command.includes('play')) {
      this.musicService.playMusic();
    } else if (command.includes('pause')) {
      this.musicService.pauseMusic();
    } else if (command.includes('next')) {
      this.musicService.nextTrack();
    } else if (command.includes('previous') || command.includes('back')) {
      this.musicService.previousTrack();
    } else if (command.includes('shuffle')) {
      this.musicService.toggleShuffle();
    } else if (command.includes('enable repeat') || command.includes('loop')) {
      this.musicService.toggleLoop();
    } else if (command.includes('volume up')) {
      this.musicService.adjustVolume(1);
    } else if (command.includes('volume down')) {
      this.musicService.adjustVolume(-1);
    } else {
      this.speak('Command not recognized.');
    }
  }

  speak(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      this.startListening(); // Resume listening after speaking
    };
    window.speechSynthesis.speak(utterance);
  }
}
