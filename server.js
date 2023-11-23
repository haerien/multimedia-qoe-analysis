const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();

app.use(cors());
const corsOptions = {
    origin: 'https://haerien.github.io',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));

const PORT = 3000;

app.use(bodyParser.json());

// MongoDB Connection
const mongoURI = 'mongodb://localhost:27017';
const dbName = 'yourDBName';
let db;

MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) return console.error(err);

  console.log('Connected to MongoDB');
  db = client.db(dbName);
});

// Endpoint to store QoS parameters
app.post('/api/storeQoS', (req, res) => {
  const qosData = req.body; // Data sent from the client
  // Store data in MongoDB
  db.collection('qosData').insertOne(qosData, (err, result) => {
    if (err) return res.status(500).send('Error storing QoS parameters');
    res.status(200).send('QoS parameters stored successfully');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
