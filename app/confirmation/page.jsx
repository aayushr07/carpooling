"use client"; // Ensures this page is a client-side component
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Confirmation() {
  const searchParams = useSearchParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());

    // If no rideId is found, redirect to home
    if (!params.rideId) {
      router.push("/");
      return; // Prevent further execution
    }

    try {
      // Parse and set the booking details from URL parameters
      setBookingDetails({
        passengers: params.passengers,
        carType: params.carType,
        source: JSON.parse(params.source),
        destination: JSON.parse(params.destination),
        time: params.time,
        fare: params.fare,
        sourceName: params.sourceName,
        destinationName: params.destinationName,
        passengerDetails: JSON.parse(params.details),
      });
    } catch (error) {
      console.error("Error parsing booking details:", error);
      router.push("/"); // Redirect in case of an error
    }
  }, [searchParams, router]);

  // If bookingDetails is not available yet, show a loading message
  if (!bookingDetails) {
    return <p>Loading...</p>;
  }

  // Render the confirmation details once available
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Booking Confirmation</h2>
        <p className="text-lg mb-2"><strong>Passengers:</strong> {bookingDetails.passengers}</p>
        <p className="text-lg mb-2"><strong>Car Type:</strong> {bookingDetails.carType}</p>
        <p className="text-lg mb-2"><strong>Source:</strong> {bookingDetails.sourceName}</p>
        <p className="text-lg mb-2"><strong>Destination:</strong> {bookingDetails.destinationName}</p>
        <p className="text-lg mb-2"><strong>Time:</strong> {bookingDetails.time}</p>
        <p className="text-lg mb-2"><strong>Fare:</strong> ₹{bookingDetails.fare}</p>

        <h3 className="text-lg font-bold mt-4 text-gray-800">Passenger Details:</h3>
        <ul className="list-disc list-inside">
          {bookingDetails.passengerDetails.map((passenger, index) => (
            <li key={index}>
              {passenger.name}, Age: {passenger.age}
            </li>
          ))}
        </ul>

        <button
          onClick={() => router.push("/")}
          className="w-full mt-6 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
