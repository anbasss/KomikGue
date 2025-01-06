export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-20 h-20">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="w-full h-full border-4 border-t-blue-500 border-b-purple-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
        </div>
        <div className="absolute top-2 left-2 right-2 bottom-2">
          <div className="w-full h-full border-4 border-r-blue-500 border-l-purple-500 border-t-transparent border-b-transparent rounded-full animate-spin-reverse"></div>
        </div>
      </div>
    </div>
  );
}
