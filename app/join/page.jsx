"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function JoinRide() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await fetch("/api/bookings/available");
        if (!res.ok) throw new Error("Failed to fetch rides.");
        const data = await res.json();
        console.log("Fetched rides:", data);
        setRides(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  const handleJoinRide = (rideId) => {
    router.push(`/join-form?rideId=${rideId}`);
  };

  if (loading) return <p>Loading rides...</p>;
  if (error) return <p>Error loading rides: {error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Available Rides</h1>
      {rides.length === 0 ? (
        <p>No rides available at the moment.</p>
      ) : (
        <ul className="space-y-4">
          {rides.map((ride) => (
            <li key={ride._id} className="bg-white text-black p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-bold">
              Ride to {ride.destinationName || "Location not available"} {/* Display destinationName */}
            </h2>
            <p>Car Type: {ride.carType}</p>
            <p>Passengers: {ride.passengers}</p>
            <p>Available Seats: {ride.availableSeats}</p>
            
            <h3 className="font-medium">Passenger Details:</h3>
            <ul className="list-disc ml-6">
              {ride.passengerDetails.map((passenger, index) => (
                <li key={index}>
                  {passenger.name} (Age: {passenger.age})
                </li>
              ))}
            </ul>
          
            <button
              className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
              onClick={() => handleJoinRide(ride._id)}
            >
              Join Ride
            </button>
          </li>
          
          ))}
        </ul>
      )}
    </div>
  );
}
