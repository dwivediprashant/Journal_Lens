import "./Footer.css";
export default function Footer() {
  const sources = [
    { name: "SAGE Publishing", link: "https://journals.sagepub.com/" },
    { name: "IOP Publishing", link: "https://iopscience.iop.org/" },
    { name: "Directory of Open Access Journals", link: "https://doaj.org/" },
    { name: "Public Library of Science", link: "https://plos.org/" },
    { name: "Elsevier", link: "https://www.sciencedirect.com/" },
    { name: "IEEE", link: "https://ieeexplore.ieee.org/" },
    { name: "Springer", link: "https://link.springer.com/" },
    { name: "Wiley", link: "https://onlinelibrary.wiley.com/" },
    { name: "SciELO", link: "https://scielo.org/" },
    { name: "Taylor & Francis", link: "https://www.tandfonline.com/" },
    { name: "MDPI", link: "https://www.mdpi.com/" },
    { name: "Frontiers Media", link: "https://www.frontiersin.org/" },
    { name: "BioMed Central", link: "https://www.biomedcentral.com/" },
    { name: "Hindawi", link: "https://www.hindawi.com/" },
    { name: "Bentham Open", link: "https://benthamopen.com/" },
    { name: "De Gruyter", link: "https://www.degruyter.com/" },
    { name: "Copernicus Publications", link: "https://www.copernicus.org/" },
    { name: "American Physical Society", link: "https://journals.aps.org/" },
    { name: "Scientific Research Publishing", link: "https://www.scirp.org/" },
  ];

  return (
    <footer className="bg-sky-50 text-black mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Top Section */}

        <div className="main-wrapper">
          {/* Brand */}

          <div className="brand">
            <h2 className="text-4xl font-bold mr-5">
              Journal<span className="text-blue-500">Lens</span>
              <i className="fa-solid fa-magnifying-glass fa-bounce m-3"></i>
            </h2>

            <p className="text-black">
              Search academic research across trusted sources in one place.
              <span className="text-black">
                {" "}
                Organized & Easy accessible Journals
              </span>
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

          {/* Social Media */}
          <div>
            <div>
              <h3 className="  mb-3 text-blue-700">Connect</h3>
              <div className="social-media flex space-x-4">
                <a href="#">
                  <i className="fa-brands fa-square-x-twitter"></i>
                </a>
                <a href="#">
                  <i className="fa-brands fa-linkedin"></i>
                </a>
                <a href="#">
                  <i className="fa-brands fa-square-github"></i>
                </a>
                <a href="">
                  <i className="fa-brands fa-square-instagram"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="footer-logo">
            <img
              src="https://lnct.ac.in/wp-content/uploads/2021/04/lnct-g-logo.png"
              alt=""
            />
          </div>
        </div>

        <div className="sources-bottom">
          <h3 className="mb-3 text-blue-700">All Sources</h3>
          <ul className="sources-list">
            {sources.map((source) => (
              <li key={source.name}>
                <a
                  href={source.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {source.name}
                </a>
              </li>
            ))}
          </ul>
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
