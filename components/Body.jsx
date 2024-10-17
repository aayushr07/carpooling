"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Body() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isRequesting, setIsRequesting] = useState(false);

    const handleRequestClick = () => {
        if (status === "loading") {
          // Optionally, show loading UI while checking the session
          return;
        }
    
        if (!session) {
          // If the user is not logged in, redirect to the login page
          router.push("/login");
        } else {
          // If logged in, proceed with the request
          setIsRequesting(true);
          setTimeout(() => {
            setIsRequesting(false);
            // Redirect to the form after the simulated request process
            router.push("/form");
          }, 2000); // Simulate request process (you can remove this timeout if you handle actual requests)
        }
  };

  return (
    <main className="bg-gray-100 text-gray-800 min-h-screen flex flex-col">
      {/* Hero Section */}
      <section id="hero" className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white shadow-md">
        <h1 className="text-4xl font-bold mb-4 transition-transform duration-300 ease-in-out">
          Join Our Carpooling Network
        </h1>
        <p className="text-lg mb-2">
          Save money, reduce carbon footprint, and make new friends along the way.
        </p>
        <p className="text-md mb-6 max-w-2xl mx-auto">
          Whether you're commuting to work or taking a trip, our carpooling platform connects you with others heading your way.
        </p>
      </section>

      {/* Call to Action Section */}
      <section id="cta" className="bg-blue-700 py-12 px-4 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-white">
          Ready to Carpool?
        </h2>
        <p className="text-md mb-6 text-white">
          Sign up today to find or offer rides in your area.
        </p>
        <a
          
          onClick={handleRequestClick} // Call the handleRequestClick function
          className={`bg-white hover:bg-gray-200 text-blue-600 font-semibold py-2 px-4 rounded-lg shadow transition-transform duration-300 ${isRequesting ? 'animate-bounce' : ''}`}
        >
          {isRequesting ? 'Connecting...' : 'Find a Ride'}
        </a>
      </section>

      {/* Features Section */}
      <section id="about" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Why Carpool with Us?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-4">Reduce Travel Costs</h3>
              <p>Share fuel expenses and save money on your daily commute or trips.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-4">Eco-Friendly Travel</h3>
              <p>Help reduce traffic congestion and carbon emissions by sharing rides.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-4">Safe and Reliable</h3>
              <p>We ensure that all drivers and passengers are verified for a safe experience.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-4">Flexible Scheduling</h3>
              <p>Easily schedule rides that fit your time and route preferences.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-4">Meet New People</h3>
              <p>Expand your network by meeting and commuting with like-minded individuals.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-4">Convenient Booking</h3>
              <p>Book a ride or offer a seat in just a few clicks with our easy-to-use platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-200 py-6 text-center">
        <p className="text-gray-600">© 2024 Carpooling Platform. All rights reserved.</p>
      </footer>
    </main>
  );
}
