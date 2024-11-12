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

  console.log("Command heard: " + command); // Log the recognized command

  if (!isSpeaking) {
    // Ensure speak is only called once
    handleCommand(command);
    stopListening(); // Stop listening automatically after processing the command
  }
};
//Function for all commands
function handleCommand(command) {
  console.log("Handling command: " + command);

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
    adjustVolume(command, 1);
  } else if (command.includes("volume down")) {
    adjustVolume(command, -1);
  } else {
    speak("Command not recognized.");
    console.log("Unrecognized command: " + command);
  }
}

function playMusic() {
  console.log("Playing music."); // Log when music is played
  audio.play();
  speak("Playing music.");
}

function pauseMusic() {
  console.log("Pausing music."); // Log when music is paused
  audio.pause();
  speak("Music paused.");
}

function nextTrack() {
  if (isShuffling) {
    currentTrackIndex = Math.floor(Math.random() * musicFiles.length);
    console.log("Shuffling to next track: " + musicFiles[currentTrackIndex]); // Log shuffle action
  } else {
    currentTrackIndex = (currentTrackIndex + 1) % musicFiles.length;
    console.log("Playing next track: " + musicFiles[currentTrackIndex]); // Log next track action
  }
  audio.src = musicFiles[currentTrackIndex];
  audio.play();
  speak("Next track.");
}

function previousTrack() {
  currentTrackIndex =
    (currentTrackIndex - 1 + musicFiles.length) % musicFiles.length;
  console.log("Playing previous track: " + musicFiles[currentTrackIndex]); // Log previous track action
  audio.src = musicFiles[currentTrackIndex];
  audio.play();
  speak("Previous track.");
}

function toggleShuffle() {
  isShuffling = !isShuffling;
  console.log(isShuffling ? "Shuffle mode enabled." : "Shuffle mode disabled."); // Log shuffle toggle
  speak(isShuffling ? "Shuffle mode enabled." : "Shuffle mode disabled.");
}

function toggleLoop() {
  isLooping = !isLooping;
  audio.loop = isLooping;
  console.log(
    isLooping ? "Repeat mode is enabled." : "Repeat mode is disabled."
  ); // Log loop toggle
  speak(isLooping ? "Repeat mode is enabled." : "Repeat mode is disabled.");
}

function adjustVolume(command, direction) {
  console.log(
    "Adjusting volume. Command: " + command + ", Direction: " + direction
  ); // Log volume adjustment

  // Extract the percentage from the command
  const percentageMatch = command.match(/(\d+)%/);

  if (percentageMatch) {
    let percentage = parseInt(percentageMatch[1], 10);
    percentage = Math.min(Math.max(percentage, 0), 100);
    let volumeChange = (percentage / 100) * direction; // Calculate the volume change

    // Update the audio volume
    audio.volume = Math.min(Math.max(audio.volume + volumeChange, 0), 1); // Ensure volume stays within 0-1 range
    console.log(`Volume adjusted to: ${Math.round(audio.volume * 100)}%`);
    speak(`Volume is now ${Math.round(audio.volume * 100)} percent.`);
  } else {
    console.log("Volume change failed. No percentage specified."); // Log if volume percentage is not specified
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

    console.log("Speaking: " + text); // Log the speech output
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
