import Card from "../Card/Card";
import PublisherCard from "../publishers-card/PublisherCard";
import "./Hero.css";
import { Link } from "react-router";

export default function Hero() {
  return (
    <div>
      <div className="hero flex justify-between m-5">
        <div className="left m-5 p-5">
          <p>
            This project provides a unified platform for students to search and
            access research papers and journals from multiple scholarly sources
            such as IEEE, CORE, DOAJ, and arXiv. It allows users to filter
            content based on domains like AI/ML, Civil, and Mechanical
            Engineering, making it easier to discover relevant academic
            resources in one place. A centralized platform to search and explore
            research papers and journals from multiple academic sources with
            domain-based filtering.
          </p>
          <button className="hero-btn text-white p-3 rounded-xl m-5">
            <Link to="/journals">Explore Journals</Link>
          </button>
        </div>
        <div className="right mr-5 flex place-items-center">
          <img
            src="https://supertekglassware.com/wp-content/uploads/2024/12/front-view-science-elements-with-chemicals-composition-scaled.jpg"
            alt=""
            className="head-img"
          />
        </div>
      </div>
      <div className="flex p-5 justify-around">
        {/* <Card
          title="Potentials Magazine"
          desc="desc-1"
          headerColor="bg-green-300"
          bodyColor="bg-green-200"
          src={`https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/IEEE_logo.svg/1280px-IEEE_logo.svg.png`}
        />
        <Card
          title="IEEE Access"
          desc="desc-2"
          headerColor="bg-teal-300"
          bodyColor="bg-teal-200"
          src={`https://bg.uek.krakow.pl/otwarta-nauka/wp-content/uploads/2015/03/elsevier.jpg`}
        />
        <Card
          title="Proceedings of the IEEE"
          desc="desc-3"
          headerColor="bg-blue-400"
          bodyColor="bg-blue-200"
          src={`https://biblioteca.cuc.edu.co/wp-content/uploads/2022/09/49.png`}
        /> */}
        <PublisherCard />
      </div>
    </div>
  );
}
