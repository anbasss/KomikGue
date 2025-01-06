"use client";

import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

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
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <a href="/" className="text-xl font-bold">KomikGue</a>
          </div>

          {/* Hamburger Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-0.5 bg-gray-600 dark:bg-gray-300 mb-1"></div>
            <div className="w-6 h-0.5 bg-gray-600 dark:bg-gray-300 mb-1"></div>
            <div className="w-6 h-0.5 bg-gray-600 dark:bg-gray-300"></div>
          </button>

         
        </div>

        {/* Mobile Menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden pt-4`}>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black dark:text-white dark:bg-gray-700 dark:border-gray-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              {loading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <LoadingSpinner size="small" />
                </div>
              )}
            </div>
            <button
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
