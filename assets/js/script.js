// Initialize SpeechRecognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.continuous = false; // Automatically stop after one command
recognition.interimResults = false;

let isListening = false; // Flag to track the listening state
let isSpeaking = false; // Flag to prevent multiple speech outputs
let isShuffling = false; // Flag for shuffle mode
let isLooping = false; // Flag for loop/repeat mode

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

// Set initial audio source
const audio = new Audio(musicFiles[currentTrackIndex]);

// Function to auto stop listening after command is heard
recognition.onresult = (event) => {
  const command = event.results[event.results.length - 1][0].transcript
    .trim()
    .toLowerCase();

  if (!isSpeaking) {
    // Ensure speak is only called once
    handleCommand(command);
    stopListening(); // Stop listening automatically after processing the command
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
  } else if (command.includes("shuffle")) {
    toggleShuffle();
  } else if (command.includes("enable repeat") || command.includes("loop")) {
    toggleLoop();
  } else if (command.includes("volume up")) {
    adjustVolume(command, 1); // Increase volume
  } else if (command.includes("volume down")) {
    adjustVolume(command, -1); // Decrease volume
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
  if (isShuffling) {
    currentTrackIndex = Math.floor(Math.random() * musicFiles.length);
  } else {
    currentTrackIndex = (currentTrackIndex + 1) % musicFiles.length;
  }
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

function toggleShuffle() {
  isShuffling = !isShuffling;
  speak(isShuffling ? "Shuffle mode enabled." : "Shuffle mode disabled.");
}

function toggleLoop() {
  isLooping = !isLooping;
  audio.loop = isLooping;
  speak(isLooping ? "Repeat mode enabled." : "Repeat mode disabled.");
}

function adjustVolume(command, direction) {
  // Extract the percentage from the command (e.g., "volume up by 50%")
  const percentageMatch = command.match(/(\d+)%/);

  if (percentageMatch) {
    let percentage = parseInt(percentageMatch[1], 10);
    percentage = Math.min(Math.max(percentage, 0), 100); // Clamp between 0 and 100
    let volumeChange = (percentage / 100) * direction; // Calculate the volume change

    // Update the audio volume
    audio.volume = Math.min(Math.max(audio.volume + volumeChange, 0), 1); // Ensure volume stays within 0-1 range
    speak(`Volume is now ${Math.round(audio.volume * 100)} percent.`);
  } else {
    speak("Please specify a percentage for the volume change.");
  }
}

function updateTrackProgress() {
  const progressBar = document.getElementById("progress-bar");
  const currentTimeDisplay = document.getElementById("current-time");
  const durationDisplay = document.getElementById("duration");

  audio.addEventListener("timeupdate", () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;

    // Format the current time and duration
    const currentTimeFormatted = formatTime(audio.currentTime);
    const durationFormatted = formatTime(audio.duration);

    currentTimeDisplay.textContent = currentTimeFormatted;
    durationDisplay.textContent = durationFormatted;
  });
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
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

// Initialize track progress update
updateTrackProgress();
