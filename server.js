const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();

app.use(express.json());
app.use(cors());
/*const corsOptions = {
    origin: 'https://haerien.github.io',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};*/
//app.use(cors(corsOptions));

const PORT = 3000 || process.env.PORT;

app.use(bodyParser.json());

// MongoDB Connection
const mongoURI = 'mongodb+srv://admin:admin@cluster0.1e9ebol.mongodb.net/?retryWrites=true&w=majority';
//const mongoURI = 'mongodb://localhost:27017';
const dbName = 'api';
let db;

MongoClient.connect(mongoURI, {serverSelectionTimeoutMS: 5000})
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db(dbName);
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// Endpoint to store QoS parameters
app.post('/api', (req, res) => {
  const qosData = req.body; // Data sent from the client
  // Store data in MongoDB
  db.collection('qosData').insertOne(qosData, (err, result) => {
    if (err) return res.status(500).send('Error storing QoS parameters');
    res.status(200).send('QoS parameters stored successfully');
  });
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(process.env.PORT || PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
