import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("carpool");

    // Fetch all rides from the 'bookings' collection
    const rides = await db.collection("bookings").find().toArray();

    // Return the rides as JSON
    return new Response(JSON.stringify(rides), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch rides", error }),
      { status: 500 }
    );
  }
}
