"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";

export default function ManhwaPage() {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("https://kurokami.vercel.app/api/manhwa-popular")
      .then((res) => res.json())
      .then((data) => {
        console.log("Popular Manhwa Data:", data);
        setComics(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching comics:", error);
        setLoading(false);
      });
  }, []);

  const handleClick = async (comic) => {
    const manhwaId = comic.link.split('/manga/')[1]?.replace(/\/$/, '');

    if (!manhwaId) {
      console.error("Could not determine manhwa ID from:", comic);
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
    <div className="space-y-4">
      <h1 className="text-xl font-bold mb-4">Yang Lagi Populer 🔥</h1>
      <div className="space-y-2">
        {comics.map((comic, index) => (
          <div
            key={index}
            className="flex items-start gap-2 cursor-pointer p-2"
            onClick={() => handleClick(comic)}
          >
            <span className="text-lg font-bold">{index + 1}.</span>
            <img
              src={comic.imageSrc}
              alt={comic.title}
              className="object-cover "
              width={100}
              height={120}
            />
            <div className="flex flex-col flex-1 min-w-0">
              <h2 className="text-sm font-semibold break-words">{comic.title}</h2>
              <p className="text-xs text-gray-500">Ch. {comic.chapter}</p>
              <div className="flex items-center">
                <span className="text-xs text-yellow-500 pr-1">★</span>
                <span className="text-xs text-gray-500">{comic.rating}</span>
              </div>
              <ul className="text-xs text-gray-500 space-y-1">
                {comic.chapters?.slice(0, 2).map((chapter, idx) => (
                  <li key={idx} className="truncate">
                    <span className="text-blue-500">
                      {chapter.chapterTitle}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
