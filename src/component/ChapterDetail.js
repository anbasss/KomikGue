"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Spinner } from './Spinner'; // You'll need to create this component

// Add new ImageLoader component
const ImageLoader = ({ src, alt, className }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative min-h-[200px] bg-gray-100 rounded-lg">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner className="w-8 h-8 text-blue-500" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${hasError ? 'hidden' : ''}`}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg">
          <p className="text-red-500 text-sm">Failed to load image</p>
        </div>
      )}
    </div>
  );
};

export default function ChapterDetail() {
    const [chapter, setChapter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const params = useParams();
    const router = useRouter();
    
    // Get chapter ID directly from params
    const chapterId = params?.chapterId;

    useEffect(() => {
        const fetchChapter = async () => {
            if (!chapterId) {
                console.error("No chapter ID provided");
                setError("Invalid chapter selection");
                setLoading(false);
                return;
            }

            try {
                const apiUrl = `https://kurokami.vercel.app/api/chapter/${chapterId}`;
                console.log("Attempting to fetch:", apiUrl);

                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'omit',
                    next: { revalidate: 0 }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                
                if (!data) {
                    throw new Error("No data received from API");
                }

                console.log("Received data:", data);
                
                if (data.title) {
                    setChapter(data);
                    setError(null);
                } else {
                    throw new Error("Invalid data format received from API");
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.message || "Failed to load chapter");
            } finally {
                setLoading(false);
            }
        };

        fetchChapter();
    }, [chapterId]);

    const getProxiedImageUrl = (imageUrl) => {
        if (!imageUrl) return '/images/error-image.png';
        try {
            // Handle both encoded and non-encoded URLs
            const cleanUrl = imageUrl.replace(/^https?:\/\//, '');
            const finalUrl = `https://${cleanUrl}`;
            return `/api/image-proxy?url=${encodeURIComponent(finalUrl)}`;
        } catch (error) {
            console.error('Error processing image URL:', error);
            return '/images/error-image.png';
        }
    };

    // Update navigation function to use simple chapter URLs
    const handleChapterNavigation = (direction) => {
        if (!chapter) return;
        
        const targetChapter = direction === 'prev' ? chapter.prevChapter : chapter.nextChapter;
        if (targetChapter) {
            setLoading(true);
            // Clean the URL by removing the domain part
            const cleanChapterId = targetChapter.replace('https://komikstation.co/', '');
            router.push(`/chapter/${cleanChapterId}`);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-900">
            <Spinner className="w-12 h-12 text-indigo-600" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <p className="text-red-500 dark:text-red-400 text-center font-medium">{error}</p>
                <button 
                    onClick={() => router.push('/')}
                    className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );

    if (!chapter) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Chapter Not Found</h2>
                <button 
                    onClick={() => router.push('/')}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg z-50">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <h1 className="text-lg font-bold text-center mb-4 dark:text-white text-gray-800 line-clamp-2">{chapter.title}</h1>
                    <div className="flex justify-between items-center gap-4">
                        <button
                            onClick={() => handleChapterNavigation('prev')}
                            disabled={!chapter.prevChapter}
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                        >
                            Previous
                        </button>
                        <span className="font-medium px-6 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg dark:text-white text-gray-700">
                            Ch. {chapter.currentChapter}
                        </span>
                        <button
                            onClick={() => handleChapterNavigation('next')}
                            disabled={!chapter.nextChapter}
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </nav>

            {/* Reader Content */}
            <div className="max-w-4xl mx-auto px-4 pt-36 pb-20">
                <div className="space-y-6">
                    {chapter.images.map((image, index) => (
                        <ImageLoader
                            key={index}
                            src={getProxiedImageUrl(image)}
                            alt={`Page ${index + 1}`}
                            className="w-full h-auto rounded-xl shadow-xl"
                        />
                    ))}
                </div>

                {/* Bottom Navigation */}
                <div className="mt-10 flex justify-between items-center gap-4">
                    <button
                        onClick={() => handleChapterNavigation('prev')}
                        disabled={!chapter.prevChapter}
                        className="flex-1 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                    >
                        Previous Chapter
                    </button>
                    <button
                        onClick={() => handleChapterNavigation('next')}
                        disabled={!chapter.nextChapter}
                        className="flex-1 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                    >
                        Next Chapter
                    </button>
                </div>
            </div>
        </div>
    );
}