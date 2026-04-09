import Search from "../Search/Search";
export default function Footer() {
  return (
    <footer className="bg-sky-50 text-black mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Top Section */}
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h2 className="text-4xl font-bold mr-5">Journal Lens</h2>
            <p className="text-gray-700">
              Search academic research across trusted sources in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className=" mb-3 text-blue-700">Quick Links</h3>
            <ul className="space-y-2 ">
              <li>
                <a href="/" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="/journals" className="hover:underline">
                  See Journals
                </a>
              </li>
            </ul>
          </div>

          {/* Sources */}
          <div>
            <h3 className=" mb-3 text-blue-700">Sources</h3>
            <ul className="space-y-2 ">
              <li>IEEE</li>
              <li>Springer</li>
              <li>Elsevier</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <div>
              <h3 className="  mb-3 text-blue-700">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-blue-600">
                  <i className="fab fa-twitter fa-lg"></i>
                </a>
                <a href="#" className="hover:text-blue-600">
                  <i className="fab fa-linkedin-in fa-lg"></i>
                </a>
                <a href="#" className="hover:text-blue-600">
                  <i className="fab fa-github fa-lg"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-sky-300 mt-8 pt-4 text-gray-500 text-center">
          © {new Date().getFullYear()} Journal Lens — Built for academic
          research
        </div>
      </div>
    </footer>
  );
}
