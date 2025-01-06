"use client";

import { useState } from "react";
import NewManhwa from "../component/NewManhwa";
import PopularManhwa from "../component/ManhwaPopular";
import ManhwaRecommendation from "@/component/ManhwaRecomendation";
import Navbar from "../component/Navbar";

export default function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearchResults = (results, hasSearched) => {
    setSearchResults(results);
    setSearched(hasSearched);
  };

  return (
    <>
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <Navbar onSearch={handleSearchResults} />
        <div className="p-4 md:p-8 mt-16">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-6">
              {/* Search Results */}
              {searched && searchResults.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Search Results</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center">
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        className="p-2 shadow hover:shadow-lg transition w-[160px]"
                      >
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <img
                            src={result.image}
                            alt={result.title}
                            className="w-full h-[200px] object-contain rounded-md mb-2"
                          />
                        </a>
                        <h3 className="text-sm font-semibold truncate">
                          {result.title}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Ch: {result.latestChapter}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : searched ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <p className="text-center text-gray-500">No results found.</p>
                </div>
              ) : null}

              {/* Popular and New Manhwa Sections */}
              <div className="grid gap-6">
                <div className="dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <ManhwaRecommendation />
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <NewManhwa />
                </div>
              </div>
            </div>

            {/* Side Card */}
            <div className="lg:w-72 h-fit space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 top-4">
                <h2 className="text-lg font-semibold mb-3">API Source</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  API Komik ini dari website{" "}
                  <a
                    href="https://komikstation.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Komik Station
                  </a>
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 top-4">
                <h2 className="text-lg font-semibold mb-3">
                  Kata - Kata Hari Ini
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  JANGAN LUPA MAKAN LEK
                </p>
              </div>
              <div className="bg-transparent dark:bg-transparent rounded-xl shadow-none p-0">
                <PopularManhwa />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
