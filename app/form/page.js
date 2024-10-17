"use client";

import { useRouter } from 'next/navigation';

export default function FormPage() {
  const router = useRouter();

  const handleBookRideClick = () => {
    router.push('/book'); // Redirect to the book ride page
  };

  const handleJoinRideClick = () => {
    router.push('/join'); // Redirect to the join ride page
  };

  return (
    <main className="bg-gray-100 min-h-screen flex items-center justify-center py-10 px-4">
      <section className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          What would you like to do?
        </h1>
        <p className="text-lg mb-8 text-gray-600">
          Choose an option below to either book a ride or join an existing ride.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Book a Ride */}
          <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md hover:bg-blue-700 transition-transform duration-300 ease-in-out cursor-pointer"
               onClick={handleBookRideClick}>
            <h2 className="text-xl font-semibold mb-4">Book a Ride</h2>
            <p>Need to travel somewhere? Book a ride and find a carpool partner.</p>
          </div>

          {/* Join a Ride */}
          <div className="bg-green-600 text-white p-6 rounded-lg shadow-md hover:bg-green-700 transition-transform duration-300 ease-in-out cursor-pointer"
               onClick={handleJoinRideClick}>
            <h2 className="text-xl font-semibold mb-4">Join a Ride</h2>
            <p>Looking for a ride? Join an existing carpool and share the journey.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
