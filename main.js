   // Get the video element
   const video = document.getElementById('myVideo');

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
   // Function to get the metrics
   function getMetrics() {
       const playbackQuality = video.getVideoPlaybackQuality ? video.getVideoPlaybackQuality() : {};
       const networkState = video.networkState;
       const currentTime = video.currentTime;
       const bufferedTime = video.buffered.length > 0 ? video.buffered.end(video.buffered.length - 1) : 0;

       return {
           initialDelay: initialDelay,
           bufferingEvents: bufferingEvents,
           stallings: stallings,
           droppedFrames: playbackQuality.droppedVideoFrames || 0,
           corruptedFrames: playbackQuality.corruptedVideoFrames || 0,
           networkState: networkState,
           currentTime: currentTime,
           bufferedTime: bufferedTime
       };
   }

   // Function to send metrics to your server
   function sendMetrics() {
       let metrics = getMetrics();
       // Send metrics to your server here. This could be an AJAX request, for example.
       console.log(metrics);
   }

   $("#myVideo").on("ended", function() {
       window.location.href = "questions.html"; // replace with your questions page URL
   });

   // Send metrics every 5 seconds
   setInterval(sendMetrics, 5000);