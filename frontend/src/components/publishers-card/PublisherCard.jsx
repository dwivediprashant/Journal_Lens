import "./PublisherCard.css";
import RoundCard from "./RoundCard";
export default function PublisherCard() {
  return (
    <div>
      <div className="header">
        <h1 className="w-full bg-gray-700 text-center p-1">
          Our Publishers & Journals
        </h1>
      </div>
      <div className="px-5">
        <div className="round-card-container">
          <RoundCard
            title={`Elsevier`}
            src={`https://bg.uek.krakow.pl/otwarta-nauka/wp-content/uploads/2015/03/elsevier.jpg`}
          />
          <RoundCard
            title={`IEEE`}
            src={`https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/IEEE_logo.svg/1280px-IEEE_logo.svg.png`}
          />
          <RoundCard
            title={`Springer`}
            src={`https://biblioteca.cuc.edu.co/wp-content/uploads/2022/09/49.png`}
          />
          <RoundCard
            title={`Wiley`}
            src={`https://biblioteca.cuc.edu.co/wp-content/uploads/2022/09/49.png`}
          />
          <RoundCard
            title={`SciELO`}
            src={`https://biblioteca.cuc.edu.co/wp-content/uploads/2022/09/49.png`}
          />
          <RoundCard
            title={`Taylor & Francis`}
            src={`https://biblioteca.cuc.edu.co/wp-content/uploads/2022/09/49.png`}
          />
          <RoundCard
            title={`MDPI`}
            src={`https://biblioteca.cuc.edu.co/wp-content/uploads/2022/09/49.png`}
          />
          <RoundCard
            title={`Frontier Media`}
            src={`https://biblioteca.cuc.edu.co/wp-content/uploads/2022/09/49.png`}
          />
          <RoundCard
            title={`BioMed central`}
            src={`https://biblioteca.cuc.edu.co/wp-content/uploads/2022/09/49.png`}
          />
          <RoundCard
            title={`Hindawi`}
            src={`https://biblioteca.cuc.edu.co/wp-content/uploads/2022/09/49.png`}
          />
          <RoundCard
            title={`Bentham Open`}
            src={`https://biblioteca.cuc.edu.co/wp-content/uploads/2022/09/49.png`}
          />
          <RoundCard
            title={`De Gruyter`}
            src={`https://biblioteca.cuc.edu.co/wp-content/uploads/2022/09/49.png`}
          />
          <RoundCard
            title={`Copernicus publications`}
            src={`https://biblioteca.cuc.edu.co/wp-content/uploads/2022/09/49.png`}
          />
          <RoundCard
            title={`American physical society `}
            src={`https://biblioteca.cuc.edu.co/wp-content/uploads/2022/09/49.png`}
          />
        </div>
      </div>
    </div>
  );
}
