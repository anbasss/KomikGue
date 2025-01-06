"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export default function ManhwaPage() {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("https://kurokami.vercel.app/api/manhwa-new")
      .then((res) => res.json())
      .then((data) => {
        // Log the structure of the first comic to debug
        if (data && data.length > 0) {
          console.log("Sample comic structure:", data[0]);
        }
        setComics(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching comics:", error);
        setLoading(false);
      });
  }, []);

  const handleClick = async (comic) => {
    // Extract manhwaId from the comic URL
    const manhwaId = comic.link.split('/manga/')[1]?.replace(/\/$/, '');

    if (!manhwaId) {
      console.error("Could not determine manhwa ID from:", comic);
      alert("Invalid manhwa selection");
      return;
    }

    console.log("Using manhwa ID:", manhwaId);

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

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1280 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 1280, min: 1024 },
      items: 4
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2
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
      <h1 className="text-2xl font-bold mb-6">New Manhwa</h1>
      <Carousel
        responsive={responsive}
        infinite={true}
        removeArrowOnDeviceType={["tablet", "mobile"]}
        itemClass="px-4" // increased padding
      >
        {comics.map((comic, index) => (
          <div
            key={index}
            className="dark:bg-gray-700/50 p-4 shadow-md hover:shadow-lg transition cursor-pointer mx-2 rounded-lg" // added mx-2 for horizontal margin and rounded corners
            onClick={() => {
              console.log("Full comic data:", comic);
              handleClick(comic);
            }}
          >
            <img
              src={comic.imageSrc}
              alt={comic.title}
              className="w-full h-[250px] object-cover mb-3"
            />
            <h2 className="text-sm font-semibold truncate">{comic.title}</h2>
            <ul className="text-xs text-gray-500 space-y-1 mt-2">
              {comic.chapters.slice(0, 2).map((chapter, idx) => (
                <li key={idx} className="truncate">
                  <span className="text-blue-500">
                    {chapter.chapterTitle}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
