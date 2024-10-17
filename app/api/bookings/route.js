import clientPromise from "../../../lib/mongodb";

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("carpool"); // Your database name
    const body = await req.json();

    // Destructure body to include sourceName and destinationName
    const { passengers, passengerDetails, carType, source, sourceName, destination, destinationName, time } = body;

    // Create a new booking document
    const booking = {
      source,
      sourceName, // Store the source name
      destination,
      destinationName, // Store the destination name
      carType,
      passengers: passengerDetails.length, // Total number of passengers
      passengerDetails, // Array of passenger names and ages
      availableSeats: 6 - passengerDetails.length, // Assuming car has 6 seats
      time,
    };

    // Insert the booking into the bookings collection
    const result = await db.collection("bookings").insertOne(booking);
    const rideId = result.insertedId; // Get the rideId from the inserted document

    return new Response(JSON.stringify({ message: "Booking successful", rideId }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Booking failed", error }), {
      status: 500,
    });
  }
}
