// Get the video element
const video = document.getElementById('video-player');

// Variables to store metrics
let initialDelay = null;
let bufferingEvents = 0;
let stallings = 0;
let loadStartTime = Date.now();

// Event listener for when the video starts playing
video.addEventListener('playing', function() {
  if (initialDelay === null) {
    initialDelay = Date.now() - loadStartTime;
  }
});

// Event listener for when the video is waiting for more data
video.addEventListener('waiting', function() {
  bufferingEvents++;
});

// Event listener for when the video stalls
video.addEventListener('stalled', function() {
  stallings++;
});

// Function to get the metrics
function getMetrics() {
  const playbackQuality = video.getVideoPlaybackQuality ? video.getVideoPlaybackQuality() : {};
  const networkState = video.networkState;
  const currentTime = video.currentTime;
  const bufferedTime = video.buffered.length > 0 ? video.buffered.end(video.buffered.length - 1) : 0;
  const resolution = `${window.screen.width}x${window.screen.height}`;
  const date = new Date();
  return {
    initialDelay: initialDelay,
    bufferingEvents: bufferingEvents,
    stallings: stallings,
    droppedFrames: playbackQuality.droppedVideoFrames || 0,
    corruptedFrames: playbackQuality.corruptedVideoFrames || 0,
    networkState: networkState,
    currentTime: currentTime,
    bufferedTime: bufferedTime,
    resolution: resolution,
  };
}

// Function to send metrics to your server
/*function sendMetrics() {
  let metrics = getMetrics();

  // Sending metrics to the server using Fetch API
  fetch('http://localhost:3000/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metrics),
  })
  .then(response => {
    if (response.ok) {
      console.log('Metrics sent successfully!');
    } else {
      console.error('Failed to send metrics.');
    }
  })
  .catch(error => {
    console.error('Error sending metrics:', error);
  });
}*/

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