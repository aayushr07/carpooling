import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    // Parse the request body
    const { rideId, joinData } = await req.json();
    const passengersToAdd = joinData.passengerDetails.length;

    // Convert rideId to ObjectId (important step)
    const objectId = new ObjectId(rideId);

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("carpool");

    // Fetch the ride by rideId
    const ride = await db.collection("bookings").findOne({ _id: objectId });

    if (!ride) {
      return new Response(JSON.stringify({ message: "Ride not found" }), {
        status: 404,
      });
    }

    // Check if there are enough available seats
    if (ride.availableSeats < passengersToAdd) {
      return new Response(JSON.stringify({ message: "Not enough available seats" }), {
        status: 400,
      });
    }

    // Append selectedPoint to each passenger's details
    const passengersWithPoints = joinData.passengerDetails.map(passenger => ({
      ...passenger,
      selectedPoint: joinData.selectedPoint, // Add the selected intermediate point to each passenger
    }));

    // Update the ride with the new passenger information
    const updatedRide = await db.collection("bookings").updateOne(
      { _id: objectId },
      {
        $push: { passengerDetails: { $each: passengersWithPoints } },
        $inc: { availableSeats: -passengersToAdd }, // Decrease available seats by the number of passengers added
        $inc: { passengers: passengersToAdd }, // Increase the passenger count by the number of passengers added
      }
    );

    if (updatedRide.modifiedCount === 1) {
      return new Response(JSON.stringify({ message: "Joined ride successfully" }), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ message: "Failed to update ride" }), {
        status: 500,
      });
    }
  } catch (error) {
    console.error("Error joining ride:", error);
    return new Response(JSON.stringify({ message: "Failed to join ride", error }), {
      status: 500,
    });
  }
}
