"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function JoinForm() {
  const [passengerCount, setPassengerCount] = useState(1);
  const [passengerDetails, setPassengerDetails] = useState([{ name: "", age: "" }]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const rideId = searchParams.get("rideId");

  const handlePassengerChange = (index, field, value) => {
    const updatedDetails = [...passengerDetails];
    updatedDetails[index][field] = value;
    setPassengerDetails(updatedDetails);
  };

  const handlePassengerCountChange = (e) => {
    const count = Number(e.target.value);
    setPassengerCount(count);
    setPassengerDetails(
      Array.from({ length: count }, (_, i) => passengerDetails[i] || { name: "", age: "" })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const joinData = { passengerDetails }; // Removed unnecessary nesting

    setLoading(true);

    try {
      const res = await fetch(`/api/bookings/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rideId, joinData }),
      });

      if (res.ok) {
        const query = new URLSearchParams({
          rideId,
          details: JSON.stringify(passengerDetails),
        }).toString();
        router.push(`/join-confirmation?${query}`);
      } else {
        console.error("Failed to join the ride.");
        alert("Failed to join the ride.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while joining the ride.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Join Ride</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-md rounded-lg">
        {/* Number of Passengers */}
        <div>
          <label htmlFor="passengerCount" className="block text-sm font-medium text-gray-700">
            Number of Passengers
          </label>
          <input
            type="number"
            id="passengerCount"
            min="1"
            value={passengerCount}
            onChange={handlePassengerCountChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Passenger Details */}
        {passengerDetails.map((passenger, index) => (
          <div key={index} className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor={`name-${index}`} className="block text-sm font-medium text-gray-700">
                Passenger {index + 1} Name
              </label>
              <input
                type="text"
                id={`name-${index}`}
                value={passenger.name}
                onChange={(e) => handlePassengerChange(index, "name", e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor={`age-${index}`} className="block text-sm font-medium text-gray-700">
                Passenger {index + 1} Age
              </label>
              <input
                type="number"
                id={`age-${index}`}
                value={passenger.age}
                onChange={(e) => handlePassengerChange(index, "age", e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className={`bg-green-600 hover:bg-green-700 text-white p-2 rounded-md w-full font-semibold ${loading ? "opacity-50" : ""}`}
        >
          {loading ? "Joining..." : "Join Ride"}
        </button>
      </form>
    </div>
  );
}
