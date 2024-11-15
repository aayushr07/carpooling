// File: app/api/get-ride/[rideId]/route.js

import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  const { rideId } = params;  // Get rideId from the URL parameters
  const objectId = new ObjectId(rideId);  // Convert rideId to ObjectId for MongoDB query

  const client = await clientPromise;
  const db = client.db("carpool");

  // Fetch ride details from the database
  const ride = await db.collection("bookings").findOne({ _id: objectId });

  if (!ride) {
    return new Response(JSON.stringify({ message: "Ride not found" }), { status: 404 });
  }

  return new Response(JSON.stringify(ride), { status: 200 });
}
