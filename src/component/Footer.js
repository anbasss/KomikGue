export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 pt-5">About Komik Gue</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Website baca komik berbahasa Indonesia yang menyediakan berbagai macam manhwa terbaru.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm text-blue-500 hover:underline">Home</a>
              </li>
              <li>
                <a href="/popular" className="text-sm text-blue-500 hover:underline">Popular Manhwa</a>
              </li>
              <li>
                <a href="/new" className="text-sm text-blue-500 hover:underline">New Releases</a>
              </li>
            </ul>
          </div>

          {/* Contact/Social */}
        
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} KomikGue. All rights reserved. ( Develop By Anbas )
          </p>
        </div>
      </div>
    </footer>
  );
}
