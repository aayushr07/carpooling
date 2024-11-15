"use client"; // Ensure this component is a client component

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Leaflet CSS
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'; // Routing Machine CSS
import 'leaflet-routing-machine'; // Routing Machine

const JoinForm = () => {
  const searchParams = useSearchParams();
  const rideId = searchParams.get('rideId'); // Get rideId from query params
  const router = useRouter();

  const [rideData, setRideData] = useState(null);
  const [intermediatePoints, setIntermediatePoints] = useState([]);
  const [passengerCount, setPassengerCount] = useState(1);
  const [passengerDetails, setPassengerDetails] = useState([{ name: "", age: "" }]);
  const [selectedPoint, setSelectedPoint] = useState("");
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null); // Ref to hold the map instance

  useEffect(() => {
    // Fetch the ride data from your API based on rideId
    if (rideId) {
      setLoading(true);
      fetch(`/api/get-ride/${rideId}`)
        .then((res) => res.json())
        .then((data) => {
          setRideData(data);
          calculateIntermediatePoints(data.source, data.destination); // Get points between
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [rideId]);

  useEffect(() => {
    // Initialize the map when rideData is available
    if (rideData && mapRef.current) {
      const { lat: startLat, lng: startLng } = rideData.source;

      // Initialize the map
      const map = L.map(mapRef.current).setView([startLat, startLng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Add markers for source and destination
      L.marker([startLat, startLng]).addTo(map).bindPopup('Start Point').openPopup();
      L.marker([rideData.destination.lat, rideData.destination.lng])
        .addTo(map)
        .bindPopup('Destination Point');

      // Cleanup map instance on unmount
      return () => {
        map.remove();
      };
    }
  }, [rideData]);

  const calculateIntermediatePoints = (source, destination) => {
    const { lat: startLat, lng: startLng } = source;
    const { lat: endLat, lng: endLng } = destination;

    // Calculate the distance between the source and destination
    const distance = getDistance(startLat, startLng, endLat, endLng);
    console.log('Distance between source and destination:', distance, 'km');

    // If the distance is too small, no intermediate points will be generated
    if (distance < 5) {
        console.log('The distance is too short to generate intermediate points.');
        setIntermediatePoints([]); // No points if the distance is too short
        return;
    }

    // Create a temporary map instance for routing (we will not display this map)
    const tempMap = L.map(document.createElement('div')).setView([startLat, startLng], 13);

    // Define a custom marker icon to avoid the 404 error
    const customIcon = new L.Icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', // CDN-hosted default icon
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    // Initialize the routing control
    const routeControl = L.Routing.control({
        waypoints: [
            L.latLng(startLat, startLng),
            L.latLng(endLat, endLng),
        ],
        createMarker: () => null, // Don't create markers automatically
        routeWhileDragging: true, // Optional: for better UX while dragging
    }).addTo(tempMap);

    routeControl.on('routesfound', (e) => {
        const waypoints = e.routes[0].waypoints.map((point) => ({
            lat: point.latLng.lat,
            lng: point.latLng.lng,
        }));

        console.log('Waypoints:', waypoints); // Log the waypoints to see the route

        // Filter out the first and last points (source and destination)
        const sampledPoints = waypoints.slice(1, waypoints.length - 1); // These are the intermediate points

        // If no intermediate points found, generate custom ones
        if (sampledPoints.length === 0) {
            console.log('No intermediate points found, generating custom points.');

            // Generate multiple intermediate points (e.g., based on distance or coordinates)
            const customPoints = generateCustomIntermediatePoints(startLat, startLng, endLat, endLng, 5); // Adjust the number of points as needed
            setIntermediatePoints(customPoints); // Add generated custom points
            return;
        }

        // Sample a subset of intermediate points to display (if any)
        const numberOfPoints = Math.min(5, sampledPoints.length); // You can adjust the number of points here
        const interval = Math.floor(sampledPoints.length / numberOfPoints);
        const selectedPoints = sampledPoints.filter((_, index) => index % interval === 0);

        // Store the selected intermediate points
        setIntermediatePoints(selectedPoints);

        // Add points to the temporary map for visualization (if needed)
        selectedPoints.forEach((point) => {
            L.marker([point.lat, point.lng], { icon: customIcon }) // Use custom icon to avoid 404 error
                .addTo(tempMap)
                .bindPopup(`Point: ${point.lat.toFixed(2)}, ${point.lng.toFixed(2)}`);
        });

        // Fit the map to show all the waypoints (including source and destination)
        const bounds = L.latLngBounds(waypoints);
        tempMap.fitBounds(bounds);
    });
};

// Helper function to generate custom intermediate points
const generateCustomIntermediatePoints = (startLat, startLng, endLat, endLng, numberOfPoints) => {
    const points = [];
    const latStep = (endLat - startLat) / (numberOfPoints + 1);
    const lngStep = (endLng - startLng) / (numberOfPoints + 1);

    for (let i = 1; i <= numberOfPoints; i++) {
        const lat = startLat + latStep * i;
        const lng = startLng + lngStep * i;
        points.push({ lat, lng });
    }

    return points;
};

// Helper function to calculate distance between two points (in km)
const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};


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
  
    const joinData = {
      passengerDetails,
      selectedPoint, // Include selected point in the join data
    };
  
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
          selectedPoint,
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
      {rideData && (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-md rounded-lg">
          <p className="text-lg">Source: {rideData.sourceName}</p>
          <p className="text-lg">Destination: {rideData.destinationName}</p>

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
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Dropdown for selecting points */}
          <div>
            <label htmlFor="intermediatePoint" className="block text-sm font-medium text-gray-700">
              Select Intermediate Point:
            </label>
            <select
              id="intermediatePoint"
              value={selectedPoint}
              onChange={(e) => setSelectedPoint(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            >
              <option value="">Choose a point</option>
              {intermediatePoints.map((point, index) => (
                <option key={index} value={`${point.lat},${point.lng}`}>
                  Point {index + 1}: {point.lat.toFixed(2)}, {point.lng.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          {/* Join Ride Button */}
          <button
            type="submit"
            disabled={loading}
            className={`bg-green-600 hover:bg-green-700 text-white p-2 rounded-md w-full font-semibold transition duration-200 ease-in-out ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Joining..." : "Join Ride"}
          </button>
        </form>
      )}

      {/* Map */}
      <div ref={mapRef} className="mt-6 w-full h-80" />
    </div>
  );
};

export default JoinForm;
