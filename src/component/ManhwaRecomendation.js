"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";

export default function ManhwaRecommendationPage() {
  const [manhwaList, setManhwaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("https://kurokami.vercel.app/api/manhwa-recommendation")

      .then((res) => res.json())
      .then((data) => {
        // Ensure data is always an array
        const manhwaArray = Array.isArray(data) ? data : [data];
        setManhwaList(manhwaArray);
        
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching manhwa:", error);
        setLoading(false);
      });
  }, []);

  const handleClick = async (manhwa) => {
    const manhwaId = manhwa.link.split('/manga/')[1]?.replace(/\/$/, '');

    if (!manhwaId) {
      console.error("Could not determine manhwa ID from:", manhwa);
      alert("Invalid manhwa selection");
      return;
    }

    try {
      const response = await fetch(`https://kurokami.vercel.app/api/manhwa-detail/${manhwaId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data && data.title) {
        router.push(`/detail/${manhwaId}`);
        return;
      }
      throw new Error("Invalid data received");
    } catch (error) {
      console.error("Error fetching manhwa detail:", error);
      alert("Failed to load manhwa details. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manhwa Rekomendasi 👍</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {manhwaList.map((manhwa, index) => (
          <div
            key={index}
            className="group relative bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-1 cursor-pointer"
            onClick={() => handleClick(manhwa)}
          >
            <div className="relative">
              <img
                src={manhwa.imageSrc}
                alt={manhwa.title}
                className="w-full h-[260px] object-cover"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              {manhwa.status && (
                <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  {manhwa.status}
                </span>
              )}
            </div>
            <div className="p-3">
              <h2 className="font-semibold text-sm mb-1 line-clamp-1">{manhwa.title}</h2>
              <div className="flex flex-col justify-between">
                <p className="text-xs text-gray-500">Ch. {manhwa.chapter}</p>
                <div className="flex items-center">
                  <span className="text-xs text-yellow-500 pr-4">★</span>
                  <span className="text-xs text-gray-500">{manhwa.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
