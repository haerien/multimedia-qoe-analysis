const video = document.getElementById('video-player');

// Variables to store metrics
let initialDelay = null;
let bufferingEvents = 0;
let stallings = 0;
let loadStartTime = Date.now();
let playingTime = 0; // Variable to store playing time in milliseconds
let lastStallingTime = 0;
let lastPlayTime = 0; // Variable to store the last time the video played
let totalStallingDuration = 0; // Variable to store total stalling duration in milliseconds
let resolution;

// Event listener for when the video starts playing
video.addEventListener('playing', () => {
  if (initialDelay === null) {
    initialDelay = Date.now() - loadStartTime;
  }
  if(lastStallingTime !== 0){
    totalStallingDuration += Date.now() - lastStallingTime;
    lastStallingTime = 0;
  }
  if (lastPlayTime === 0) {
    lastPlayTime = Date.now(); // Update last play time when video starts playing
  }
});

// Event listener for when the video is waiting for more data
video.addEventListener('waiting', () => {
  bufferingEvents++;
  lastStallingTime = Date.now();
  /*if (lastPlayTime !== 0) {
    totalStallingDuration += Date.now() - lastPlayTime; // Update total stalling duration
    lastPlayTime = 0; // Reset last play time as we are now stalling
  }*/
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
    lastPlayTime,
    lastStallingTime,
    totalDuration: totalDuration * 1000, // Total duration in milliseconds
    totalStallingDuration, // Total stalling duration in milliseconds
    stallingRatio, // Stalling ratio (no unit, it's a ratio)
    resolution: screen.width + "x" + screen.height,
  };
}


let qosMetrics;

$("#video-player").on("ended", function() {
  qosMetrics = getMetrics(); //Store QoS metrics
  //localStorage.setItem('qosData', JSON.stringify(qosData)); // Storing in localStorage

  document.getElementById('content').style.display = 'none';
  document.getElementById('survey').style.display = 'block'; // Redirect to the survey page
});

const form = document.getElementById("surveyForm");

form.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent default form submission

  const formData = new FormData(form);
  const surveyData = {};
  formData.forEach((value, key) => {
    surveyData[key] = value;
  });
  
  let date = new Date();
  let combinedData = {
    qos: qosMetrics,
    survey: surveyData,
    date: `${date.getDate()}-${(date.getMonth()+1)}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`,
  }

  const response = fetch('https://powerful-island-81434-af3002721539.herokuapp.com/api', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(combinedData),
  })
  .then(response => {
    if (response.ok) {
        console.log('Data sent successfully!');
    } else {
        console.error('Failed to send data.');
        // Handle failed submission
    }
   })
    .catch(error => {
        console.error('Error sending data:', error);
        // Handle error case
    });

    document.getElementById('surveyForm').style.display = 'none';
    document.getElementById('confirmationMessage').style.display = 'block';
});