"use client";

import { useSearchParams } from "next/navigation";

export default function Confirmation() {
  const searchParams = useSearchParams();
  const passengers = searchParams.get("passengers");
  const carType = searchParams.get("carType");
  const passengerDetails = JSON.parse(searchParams.get("details") || "[]");
  const totalFare = searchParams.get("fare"); // Get the total fare from query parameters

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Booking Confirmation</h1>
      <p className="text-lg mb-4 text-center">Your booking was successful. Below are your details:</p>

      <div className="bg-white p-8 shadow-md rounded-lg max-w-xl mx-auto">
        <ul className="space-y-4">
          <li>
            <strong>Number of Passengers:</strong> {passengers}
          </li>
          <li>
            <strong>Car Type:</strong> {carType}
          </li>
          <li>
            <strong>Total Fare:</strong> ₹{totalFare} {/* Display the total fare */}
          </li>
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
