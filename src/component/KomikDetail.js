"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function KomikDetail() {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const params = useParams();
  const manhwaId = params?.manhwaId;
  const router = useRouter();

  useEffect(() => {
    if (!manhwaId) {
      setError("No manhwa ID provided");
      setLoading(false);
      return;
    }

    const fetchDetail = async () => {
      try {
        const response = await fetch(
          `https://kurokami.vercel.app/api/manhwa-detail/${manhwaId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("Manhwa Id", manhwaId); // Debug log
        const data = await response.json();
        console.log("Received data:", data); // Debug log
        setDetail(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching detail:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [manhwaId]);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingPercent((prev) => {
          if (prev < 100) {
            return prev + 1;
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 30);
    }
  }, [loading]);

  const handleChapterClick = (chapterLink) => {
    // Clean the URL by removing the base URL part
    const cleanUrl = chapterLink.replace(/^https?:\/\/[^/]+\//, '');
    // Now extract the chapter information
    const match = cleanUrl.match(/([^/]+)-chapter-([0-9.-]+)/);
    
    if (match && match[1] && match[2]) {
      const mangaName = match[1];
      const chapterNum = match[2];
      const formattedUrl = `${mangaName}-chapter-${chapterNum}`;
      console.log("Navigating to chapter:", formattedUrl);
      router.push(`/chapter/${formattedUrl}`);
    } else {
      console.error("Could not parse chapter URL:", chapterLink);
    }
  };

  if (loading) {
    return (
      <div className="fixed min-h-screen top-0 inset-0 flex flex-col gap-4 justify-center items-center bg-white dark:bg-gray-800">
        <span className="text-xl font-bold text-gray-800 dark:text-white">
          {loadingPercent}%
        </span>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="p-6">
        <div className="text-center text-red-500">
          Error: {error || "Failed to load manhwa details"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-8 bg-white dark:bg-gray-800 ">
      <div className="container mx-auto px-4 max-w-7xl">
        <button
          onClick={() => router.push("/")}
          className="mb-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          ← Back
        </button>
        <div className="rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            {/* Left Side */}
            <div className="w-full lg:w-[260px] flex-shrink-0">
              <div className="lg:sticky lg:top-8">
                <div className="flex justify-center lg:block">
                  <img
                    src={detail.imageSrc}
                    alt={detail.title}
                    className="w-[200px] h-[280px] sm:w-[240px] sm:h-[320px] lg:w-full lg:h-[360px] 
                             object-cover rounded-lg shadow-md"
                  />
                </div>
                <div className="mt-4 lg:mt-6 space-y-2.5 px-4 py-3 rounded-lg">
                  {[
                    { label: "Status", value: detail.status },
                    { label: "Type", value: detail.type },
                    { label: "Released", value: detail.released },
                    { label: "Author", value: detail.author || "Unknown" },
                    { label: "Artist", value: detail.artist || "Unknown" },
                    { label: "Updated", value: detail.updatedOn },
                  ].map((item, index) => (
                    <p
                      key={index}
                      className="text-sm flex justify-between items-center gap-4"
                    >
                      <span className="font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {item.label}:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200 text-right">
                        {item.value}
                      </span>
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex-grow">
              <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                {detail.title}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <span className="flex items-center text-lg">
                  <span className="text-yellow-500 mr-1">★</span>
                  {detail.rating}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {detail.followedBy}
                </span>
              </div>

              <div className="mb-6 lg:mb-8">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                  First & Latest Chapter
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={detail.firstChapter.link}
                    className="no-underline text-blue-500 hover:text-blue-600 px-3 py-2 rounded-lg 
                              hover:bg-blue-50 dark:hover:bg.gray-700 transition-colors"
                  >
                    First: {detail.firstChapter.title}
                  </a>
                  <a
                    href={detail.latestChapter.link}
                    className="no-underline text-blue-500 hover:text-blue-600 px-3 py-2 rounded-lg 
                              hover:bg-blue-50 dark:hover:bg.gray-700 transition-colors"
                  >
                    Latest: {detail.latestChapter.title}
                  </a>
                </div>
              </div>

              <div className="mb-6 lg:mb-8">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                  Synopsis
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {detail.synopsis}
                </p>
              </div>

              <div className="mb-6 lg:mb-8">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                  Genres
                </h2>
                <div className="flex flex-wrap gap-2">
                  {detail.genres.map((genre, index) => (
                    <a
                      key={index}
                      href={genre.genreLink}
                      className="no-underline px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 
                               hover:bg-blue-50 dark:hover:bg.gray-700 rounded-full transition-colors"
                    >
                      {genre.genreName}
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                  Chapters
                </h2>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {detail.chapters.map((chapter, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center px-3 py-2 rounded-lg 
                               hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                      onClick={() => handleChapterClick(chapter.chapterLink)}
                    >
                      <div className="flex-grow min-w-0">
                        <a
                          href="#"
                          className="no-underline text-blue-500 hover:text-blue-600 font-medium block truncate"
                          onClick={(e) => {
                            e.preventDefault();
                            handleChapterClick(chapter.chapterLink);
                          }}
                        >
                          {chapter.chapterNum}
                        </a>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {chapter.chapterDate}
                        </p>
                      </div>
                      <a
                        href={chapter.downloadLink}
                        className="no-underline px-3 py-1 text-sm text-green-600 dark:text-green-400
                                 hover:bg-green-50 dark:hover:bg.gray-700 rounded-full transition-colors 
                                 whitespace-nowrap ml-2"
                      >
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
