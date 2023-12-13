const video = document.getElementById('video-player');

// Variables to store metrics
let initialDelay = null;
let bufferingEvents = 0;
let stallings = 0;
let loadStartTime = Date.now();
let playingTime = 0; // Variable to store playing time in milliseconds
let lastPlayTime = 0; // Variable to store the last time the video played
let totalStallingDuration = 0; // Variable to store total stalling duration in milliseconds

// Event listener for when the video starts playing
video.addEventListener('playing', () => {
  if (initialDelay === null) {
    initialDelay = Date.now() - loadStartTime;
  }
  if (lastPlayTime === 0) {
    lastPlayTime = Date.now(); // Update last play time when video starts playing
  }
});

// Event listener for when the video is waiting for more data
video.addEventListener('waiting', () => {
  bufferingEvents++;
  if (lastPlayTime !== 0) {
    totalStallingDuration += Date.now() - lastPlayTime; // Update total stalling duration
    lastPlayTime = 0; // Reset last play time as we are now stalling
  }
});

// Event listener for when the video stalls
video.addEventListener('stalled', () => {
  stallings++;
});

// Event listener for when the video is paused or ends
video.addEventListener('pause', updatePlayingTime);
video.addEventListener('ended', updatePlayingTime);

// Function to update playing time
function updatePlayingTime() {
  if (lastPlayTime !== 0) {
    playingTime += Date.now() - lastPlayTime; // Update playing time
    lastPlayTime = 0; // Reset last play time
  }
}

// Function to get the metrics
function getMetrics() {
  // If the video is still playing, update the playing time
  if (!video.paused && lastPlayTime !== 0) {
    updatePlayingTime();
  }

  const totalDuration = video.duration || 0; // Total duration in seconds
  const stallingRatio = totalStallingDuration / (playingTime + totalStallingDuration); // Stalling ratio

  return {
    initialDelay,
    bufferingEvents,
    stallings,
    playingTime, // Playing time in milliseconds
    totalDuration: totalDuration * 1000, // Total duration in milliseconds
    totalStallingDuration, // Total stalling duration in milliseconds
    stallingRatio // Stalling ratio (no unit, it's a ratio)
  };
}


let qosMetrics;

$("#video-player").on("ended", function() {
  let qosData = getMetrics(); // Assuming you have a function to retrieve QoS data
  localStorage.setItem('qosData', JSON.stringify(qosData)); // Storing in localStorage

  //qosMetrics = getMetrics(); // Sending metrics when the video ends
  window.location.href = "questions.html"; // Redirect to the survey page
});

// Send metrics every 5 seconds while the video is playing
/*const interval = setInterval(() => {
  if (!video.paused && !video.ended) {
    let qosData = getMetrics(); // Assuming you have a function to retrieve QoS data
    localStorage.setItem('qosData', JSON.stringify(qosData)); // Storing in localStorage
    window.location.href = "questions.html"; // Redirect to the survey page
  } else {
    clearInterval(interval);
  }
}, 5000);*/