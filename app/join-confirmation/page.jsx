"use client";

import { useSearchParams } from "next/navigation";

export default function JoinConfirmation() {
  const searchParams = useSearchParams();
  const rideId = searchParams.get("rideId");
  const passengerDetails = JSON.parse(searchParams.get("details") || "[]");

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Join Ride Confirmation</h1>
      <p className="text-lg mb-4 text-center">You have successfully joined the ride. Below are your details:</p>

      <div className="bg-white p-8 shadow-md rounded-lg max-w-xl mx-auto">
        <ul className="space-y-4">
          <li><strong>Ride ID:</strong> {rideId}</li>
          {passengerDetails.map((passenger, index) => (
            <li key={index} className="border-t border-gray-200 pt-4">
              <strong>Passenger {index + 1}:</strong> {passenger.name}, Age: {passenger.age}
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md font-semibold"
        >
          Print Confirmation
        </button>
      </div>
    </div>
  );
}
