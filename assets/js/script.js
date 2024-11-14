// Access clientId and clientSecret from the CONFIG object
const clientId = CONFIG.CLIENT_ID;
const clientSecret = CONFIG.CLIENT_SECRET;

console.log("Client ID and Client Secret loaded from environment variables.");

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

let currentTrackIndex = 0;
let currentTrackId = ""; // Store the Spotify track ID for current track

// Spotify API credentials and endpoints
const spotifyApiUrl = "https://api.spotify.com/v1/me/player/";

let accessToken = ""; // Declare the access token variable

// Function to get the access token using client credentials flow
function getAccessToken() {
  console.log("Attempting to get access token...");

  const auth = "Basic " + btoa(clientId + ":" + clientSecret);
  console.log("Authorization header generated");

  return fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: auth,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.access_token) {
        console.log("Access Token received");
        accessToken = data.access_token; // Set the access token globally
      } else {
        throw new Error("Unable to get access token");
      }
    })
    .catch((error) => {
      console.error("Error getting access token:", error);
    });
}

// Function to authenticate and get Spotify access token
async function authenticateSpotify() {
  await getAccessToken(); // Fetch the access token
  if (accessToken) {
    console.log("Spotify authentication successful.");
  } else {
    console.error("Spotify authentication failed.");
  }
}

// Create an instance for Spotify player control
const spotifyPlayer = new Audio();

// Function to fetch the current track info from Spotify
function fetchSpotifyTrack() {
  fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.item) {
        currentTrackId = data.item.id;
        currentTrackIndex = data.item.track_number - 1; // Use track number for index
        spotifyPlayer.src = data.item.preview_url; // Use the preview URL or full URL
        console.log(
          `Now playing: ${data.item.name} by ${data.item.artists[0].name}`
        );
      } else {
        console.error("No current track available.");
      }
    })
    .catch((error) => {
      console.error("Error fetching Spotify track:", error);
    });
}

// Start listening for voice commands
recognition.onresult = (event) => {
  const command = event.results[event.results.length - 1][0].transcript
    .trim()
    .toLowerCase();

  console.log("Command heard: " + command); // Log the recognized command

  if (!isSpeaking) {
    handleCommand(command);
    stopListening(); // Stop listening automatically after processing the command
  }
};

// Function to handle commands
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
  spotifyPlayer.play();
  speak("Playing music.");
}

function pauseMusic() {
  console.log("Pausing music."); // Log when music is paused
  spotifyPlayer.pause();
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

  // Fetch and play next track from Spotify
  fetchSpotifyTrack();
  spotifyPlayer.play();
  speak("Next track.");
}

function previousTrack() {
  currentTrackIndex =
    (currentTrackIndex - 1 + musicFiles.length) % musicFiles.length;
  console.log("Playing previous track: " + musicFiles[currentTrackIndex]); // Log previous track action

  // Fetch and play previous track from Spotify
  fetchSpotifyTrack();
  spotifyPlayer.play();
  speak("Previous track.");
}

function toggleShuffle() {
  isShuffling = !isShuffling;
  console.log(isShuffling ? "Shuffle mode enabled." : "Shuffle mode disabled."); // Log shuffle toggle
  speak(isShuffling ? "Shuffle mode enabled." : "Shuffle mode disabled.");
}

function toggleLoop() {
  isLooping = !isLooping;
  spotifyPlayer.loop = isLooping;
  console.log(
    isLooping ? "Repeat mode is enabled." : "Repeat mode is disabled."
  ); // Log loop toggle
  speak(isLooping ? "Repeat mode is enabled." : "Repeat mode is disabled.");
}

function adjustVolume(command, direction) {
  console.log(
    "Adjusting volume. Command: " + command + ", Direction: " + direction
  ); // Log volume adjustment

  const percentageMatch = command.match(/(\d+)%/);

  if (percentageMatch) {
    let percentage = parseInt(percentageMatch[1], 10);
    percentage = Math.min(Math.max(percentage, 0), 100);
    let volumeChange = (percentage / 100) * direction; // Calculate the volume change

    spotifyPlayer.volume = Math.min(
      Math.max(spotifyPlayer.volume + volumeChange, 0),
      1
    ); // Ensure volume stays within 0-1 range
    console.log(
      `Volume adjusted to: ${Math.round(spotifyPlayer.volume * 100)}%`
    );
    speak(`Volume is now ${Math.round(spotifyPlayer.volume * 100)} percent.`);
  } else {
    console.log("Volume change failed. No percentage specified."); // Log if volume percentage is not specified
    speak("Please specify a percentage for the volume change.");
  }
}

function updateTrackProgress() {
  const progressBar = document.getElementById("progress-bar");
  const currentTimeDisplay = document.getElementById("current-time");
  const durationDisplay = document.getElementById("duration");

  spotifyPlayer.addEventListener("timeupdate", () => {
    const progress = (spotifyPlayer.currentTime / spotifyPlayer.duration) * 100;
    progressBar.value = progress;

    const currentTimeFormatted = formatTime(spotifyPlayer.currentTime);
    const durationFormatted = formatTime(spotifyPlayer.duration);

    currentTimeDisplay.textContent = currentTimeFormatted;
    durationDisplay.textContent = durationFormatted;
  });
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsRemaining = Math.floor(seconds % 60);
  return `${minutes}:${secondsRemaining.toString().padStart(2, "0")}`;
}

function speak(message) {
  if (isSpeaking) return;

  isSpeaking = true;

  const speech = new SpeechSynthesisUtterance(message);
  speech.onend = () => (isSpeaking = false);
  window.speechSynthesis.speak(speech);
}

function startListening() {
  if (!isListening) {
    recognition.start();
    isListening = true;
    console.log("Voice recognition started.");
    speak("Listening for commands...");
  }
}

function stopListening() {
  if (isListening) {
    recognition.stop();
    isListening = false;
    console.log("Voice recognition stopped.");
  }
}

// Initialize the app
authenticateSpotify().then(() => {
  fetchSpotifyTrack();
});
