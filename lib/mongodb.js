// /lib/mongodb.js

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let client;
let clientPromise;

// Check if we're in development or production environment
if (process.env.NODE_ENV === 'development') {
  // Create a new MongoClient for development mode
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Create a new MongoClient for production mode
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
