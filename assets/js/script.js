// Initialize SpeechRecognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.continuous = true;
recognition.interimResults = false;

let isListening = false; // Flag to track the listening state

// Create an array with the filenames of your music files
const musicFiles = [
  "assets/music/Asake - Dull.mp3",
  "assets/music/Asake - Dupe.mp3",
  "assets/music/Asake - Joha.mp3",
  "assets/music/Asake - Muse.mp3",
  "assets/music/Asake - Nzaza.mp3",
  "assets/music/Asake - Organise.mp3",
  "assets/music/Asake - Ototo.mp3",
  "assets/music/Asake - Sunmomi.mp3",
  "assets/music/Asake ft. Russ - Reason.mp3",
  "assets/music/Asake_-_Peace_Be_Unto_You.mp3",
  "assets/music/Asake-Terminator (1).mp3",
  "assets/music/Asake-Terminator.mp3",
];

let currentTrackIndex = 0;
let isSpeaking = false; // Flag to prevent multiple speech outputs

// Set initial audio source
const audio = new Audio(musicFiles[currentTrackIndex]);

recognition.onresult = (event) => {
  const command = event.results[event.results.length - 1][0].transcript
    .trim()
    .toLowerCase();

  if (!isSpeaking) {
    // Ensure speak is only called once
    handleCommand(command);
  }
};

function handleCommand(command) {
  if (command.includes("play")) {
    playMusic();
  } else if (command.includes("pause")) {
    pauseMusic();
  } else if (command.includes("next")) {
    nextTrack();
  } else if (command.includes("previous") || command.includes("back")) {
    previousTrack();
  } else {
    speak("Command not recognized.");
  }
}

function playMusic() {
  audio.play();
  speak("Playing music.");
}

function pauseMusic() {
  audio.pause();
  speak("Music paused.");
}

function nextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % musicFiles.length;
  audio.src = musicFiles[currentTrackIndex];
  audio.play();
  speak("Next track.");
}

function previousTrack() {
  currentTrackIndex =
    (currentTrackIndex - 1 + musicFiles.length) % musicFiles.length;
  audio.src = musicFiles[currentTrackIndex];
  audio.play();
  speak("Previous track.");
}

function speak(text) {
  if (!isSpeaking) {
    isSpeaking = true; // Set flag to prevent multiple calls
    const utterance = new SpeechSynthesisUtterance(text);

    // When speech ends, reset the flag
    utterance.onend = () => {
      isSpeaking = false;
    };

    window.speechSynthesis.speak(utterance);
  }
}

function toggleListening() {
  if (isListening) {
    stopListening();
  } else {
    startListening();
  }
}

function startListening() {
  recognition.start();
  isListening = true;
  document.getElementById("toggleButton").textContent = "Stop Listening";
  console.log("Voice recognition started.");
}

function stopListening() {
  recognition.stop();
  isListening = false;
  document.getElementById("toggleButton").textContent = "Start Listening";
  console.log("Voice recognition stopped.");
}
