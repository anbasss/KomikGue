"use client";

import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import Image from "next/image";

export default function Navbar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://kurokami.vercel.app/api/search/${searchQuery}`
      );
      const data = await response.json();
      onSearch(data.seriesList || [], true);
    } catch (error) {
      console.error("Error fetching search results:", error);
      onSearch([], true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="bg-gray-900 shadow-lg sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <a href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="KomikGue" width={70} height={70} />
          </a>
        </div>

        {/* Search Box */}
        <div className="hidden md:flex flex-1 max-w-lg relative">
          <input
            type="text"
            placeholder="Search comics..."
            className="w-full h-12 px-4 pr-10 text-sm bg-gray-800 border border-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 transition shadow-lg placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          {loading ? (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <LoadingSpinner size="small" />
            </div>
          ) : (
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-600 rounded-full p-2 transition"
            >
              <svg
                className="w-5 h-5 text-gray-400 hover:text-white transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className={`w-6 h-0.5 bg-white mb-1 transition-all ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-white mb-1 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 p-4 shadow-lg">
          <input
            type="text"
            placeholder="Search comics..."
            className="w-full h-10 px-4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-lg placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
      )}
    </nav>
  );
}
