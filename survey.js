const form = document.getElementById("surveyForm");

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    // Retrieving QoS data from localStorage
    let qosMetrics = localStorage.getItem('qosData');
    let qosData;
    
    if (qosMetrics) {
        qosData = JSON.parse(qosMetrics);
    // Use qosData as needed for your survey
    } else {
        console.log("Error getting data");
    // Handle case where no QoS data is found
    }

  const formData = new FormData(form);
  const surveyData = {};
  formData.forEach((value, key) => {
    surveyData[key] = value;
  });
  
  let date = new Date();
  let combinedData = {
    qos: qosData,
    survey: surveyData,
    date: `${date.getDate()}-${(date.getMonth()+1)}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`,
  }

  const response = fetch('http://localhost:3000/api', {
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

