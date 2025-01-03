"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "leaflet/dist/leaflet.css";
import { getDistance } from "geolib"; // Import geolib for distance calculation

export default function BookRide() {
  const [passengers, setPassengers] = useState(1);
  const [passengerDetails, setPassengerDetails] = useState([{ name: "", age: "" }]);
  const [carType, setCarType] = useState("Sedan");
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [sourceName, setSourceName] = useState("");
  const [destinationName, setDestinationName] = useState("");
  const [time, setTime] = useState("");
  const [selecting, setSelecting] = useState("source");
  const [fare, setFare] = useState(0);
  const router = useRouter();

  // Function to handle selecting locations on the map
  function LocationSelector() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        if (selecting === "source") {
          setSource({ lat, lng });
          reverseGeocode(lat, lng, setSourceName);
        } else if (selecting === "destination") {
          setDestination({ lat, lng });
          reverseGeocode(lat, lng, setDestinationName);
          calculateFare({ lat, lng });
        }
      },
    });
    return null;
  }

  // Reverse geocoding to fetch location names
  const reverseGeocode = async (lat, lng, setName) => {
    if (typeof window === "undefined") return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      setName(data.display_name || "Unknown location");
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
      setName("Unknown location");
    }
  };

  // Calculate fare based on distance
  const calculateFare = (destination) => {
    if (source) {
      const distanceInMeters = getDistance(source, destination);
      const distanceInKm = distanceInMeters / 1000; // Convert meters to kilometers
      const farePerKm = 10; // Fare rate per kilometer
      const calculatedFare = distanceInKm * farePerKm;
      setFare(calculatedFare);
    }
  };

  const handlePassengerChange = (index, field, value) => {
    const newDetails = [...passengerDetails];
    newDetails[index][field] = value;
    setPassengerDetails(newDetails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!source || !destination) {
      alert("Please select both source and destination on the map.");
      return;
    }

    const bookingFare = fare * passengers;
    const bookingInfo = {
      passengers,
      passengerDetails,
      carType,
      source,
      destination,
      time,
      fare: bookingFare,
      sourceName,
      destinationName,
    };

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingInfo),
    });

    if (res.ok) {
      const { rideId } = await res.json();
      const query = new URLSearchParams({
        passengers: bookingInfo.passengers,
        carType: bookingInfo.carType,
        source: JSON.stringify(bookingInfo.source),
        destination: JSON.stringify(bookingInfo.destination),
        time: bookingInfo.time,
        fare: bookingInfo.fare,
        sourceName: bookingInfo.sourceName,
        destinationName: bookingInfo.destinationName,
        details: JSON.stringify(bookingInfo.passengerDetails),
        rideId,
      }).toString();

      router.push(`/confirmation?${query}`);
    } else {
      console.error("Booking failed.");
    }
  };

  useEffect(() => {
    // This effect can be used to perform any actions needed upon component mount
    // Currently, nothing specific is needed here but can be useful for future additions
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Book a Ride</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-md rounded-lg">
        <div>
          <h2 className="text-lg font-medium text-gray-700">Select Source and Destination on the Map</h2>
          <div className="flex items-center justify-between my-4">
            <button
              type="button"
              onClick={() => setSelecting("source")}
              className={`p-2 rounded-md ${selecting === "source" ? "bg-green-500 text-white" : "bg-gray-300"}`}
            >
              Set Source
            </button>
            <button
              type="button"
              onClick={() => setSelecting("destination")}
              className={`p-2 rounded-md ${selecting === "destination" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
            >
              Set Destination
            </button>
          </div>
          <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "300px" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationSelector />
            {source && <Marker position={[source.lat, source.lng]} />}
            {destination && <Marker position={[destination.lat, destination.lng]} />}
          </MapContainer>

          <div className="mt-4">
            {sourceName && (
              <p className="text-md text-gray-700">
                <strong>Source:</strong> {sourceName}
              </p>
            )}
            {destinationName && (
              <p className="text-md text-gray-700">
                <strong>Destination:</strong> {destinationName}
              </p>
            )}
          </div>

          {fare > 0 && (
            <div className="mt-4">
              <p className="text-lg font-bold text-gray-800">Distance: {(fare / 10).toFixed(2)} km</p>
              <p className="text-lg font-bold text-gray-800">Fare per passenger: ₹{fare.toFixed(2)}</p>
              <p className="text-lg font-bold text-gray-800">Total Fare: ₹{(fare * passengers).toFixed(2)}</p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">
            Time from Source
          </label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="passengers" className="block text-sm font-medium text-gray-700">
            Number of Passengers
          </label>
          <input
            type="number"
            id="passengers"
            min="1"
            max="6"
            value={passengers}
            onChange={(e) => {
              const num = Number(e.target.value);
              setPassengers(num);
              setPassengerDetails(
                Array.from({ length: num }, (_, i) => passengerDetails[i] || { name: "", age: "" })
              );
            }}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
        </div>

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

        <div>
          <label htmlFor="carType" className="block text-sm font-medium text-gray-700">
            Type of Car
          </label>
          <select
            id="carType"
            value={carType}
            onChange={(e) => setCarType(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          >
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Luxury">Luxury</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
}
