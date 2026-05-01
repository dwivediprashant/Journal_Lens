import Card from "../Card/Card";
import PublisherCard from "../publishers-card/PublisherCard";
import "./Hero.css";
import { Link } from "react-router";

export default function Hero() {
  return (
    <div>
      <div className="hero flex bg-gray-100 justify-between items-center m-5">
        <div className="left m-5 p-5">
          <span>
            This project presents a unified academic discovery platform that
            enables efficient searching, access, and exploration of scholarly
            research using the structured and comprehensive dataset provided by
            <span className="italic text-blue-800 ms-1 me-1 underline">
              OpenAlex
            </span>
            . By leveraging a centralized knowledge graph of research papers,
            journals, authors, and institutions, the platform reduces
            fragmentation and simplifies academic exploration within a single
            interface. It incorporates domain-based filtering—such as Artificial
            Intelligence and Machine Learning, Civil Engineering, and Mechanical
            Engineering—allowing users to quickly identify relevant work from
            large-scale datasets. Additionally, the system supports
            metadata-driven insights, helping users explore trends,
            relationships, and impactful research. Overall, the platform
            enhances accessibility, improves search efficiency, and supports
            more effective and focused research discovery.
          </span>
          <button className="hero-btn text-white p-3 rounded-xl m-5">
            <Link to="/journals">
              Explore Journals{" "}
              <i className="fa-solid fa-sheet-plastic fa-xl ms-2"></i>
            </Link>
          </button>
        </div>
        <div className="right mr-5 bg-green-800">
          <img src="/media/hero.png" alt="" className="head-img" />
        </div>
      </div>
      <div className="flex p-5 justify-around">
        <PublisherCard />
      </div>
    </div>
  );
}
