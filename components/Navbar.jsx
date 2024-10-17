"use client";

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-green-700 text-white shadow-md p-5">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-white text-2xl font-bold">Apex Car Pooling</div>
        <div className="hidden md:flex space-x-8">
          <a href="/" className="hover:text-blue-400 transition-colors duration-300 transform hover:scale-105">Home</a>
          <a href="/form" className="hover:text-blue-400 transition-colors duration-300 transform hover:scale-105">Services</a>
          <a href="/#about" className="hover:text-blue-400 transition-colors duration-300 transform hover:scale-105">About</a>
          <a href="/contact" className="hover:text-blue-400 transition-colors duration-300 transform hover:scale-105">Contact</a>
          {session ? (
            <>
              <a href="/profile" className="hover:text-blue-400 transition-colors duration-300 transform hover:scale-105">Profile</a>
              <button onClick={() => signOut()} className="hover:text-blue-400 transition-colors duration-300 transform hover:scale-105">Sign Out</button>
            </>
          ) : (
            <a href="/login" className="hover:text-blue-400 transition-colors duration-300 transform hover:scale-105">Login</a>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white">
            {isOpen ? (
              <motion.svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <motion.path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </motion.svg>
            ) : (
              <motion.svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <motion.path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </motion.svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-gray-800 p-5 rounded-lg"
        >
          <a href="/" className="block text-white py-2 hover:text-blue-400 transition-colors duration-300 transform hover:scale-105">Home</a>
          <a href="#services" className="block text-white py-2 hover:text-blue-400 transition-colors duration-300 transform hover:scale-105">Services</a>
          <a href="#about" className="block text-white py-2 hover:text-blue-400 transition-colors duration-300 transform hover:scale-105">About</a>
          <a href="#contact" className="block text-white py-2 hover:text-blue-400 transition-colors duration-300 transform hover:scale-105">Contact</a>
          {session ? (
            <>
              <a href="/profile" className="block text-white py-2 hover:text-blue-400 transition-colors duration-300 transform hover:scale-105">Profile</a>
              <button onClick={() => signOut()} className="block text-white py-2 hover:text-blue-400 transition-colors duration-300 transform hover:scale-105">Sign Out</button>
            </>
          ) : (
            <a href="/login" className="block text-white py-2 hover:text-blue-400 transition-colors duration-300 transform hover:scale-105">Login</a>
          )}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
