import "./PublisherCard.css";
import RoundCard from "./RoundCard";
export default function PublisherCard() {
  return (
    <div>
      <div className="header">
        <h1 className="w-full text-center p-1">Journal Providers</h1>
      </div>
      <div className="round-card-wrapper">
        <div className="round-card-container">
          <RoundCard title={`SciELO`} src={`/media/publishers/scielo.png`} />
          <RoundCard
            title={`IOP Publishing`}
            src={`/media/publishers/iop.png`}
          />
          <RoundCard
            title={"Directory of Open Access Journals"}
            src={`/media/publishers/doaj.png`}
          />
          <RoundCard
            title={"Public Library of Science"}
            src={`/media/publishers/plos.png`}
          />
          <RoundCard
            title={`Elsevier`}
            src={`/media/publishers/elsevier.png`}
          />
          <RoundCard title={`IEEE`} src={`/media/publishers/ieee.png`} />
          <RoundCard
            title={`Springer`}
            src={`/media/publishers/springer.png`}
          />
          <RoundCard title={`Wiley`} src={`/media/publishers/wiley.png`} />

          <RoundCard
            title={`SAGE Publishing`}
            src={`/media/publishers/sage.png`}
          />
          <RoundCard
            title={`Taylor & Francis`}
            src={`/media/publishers/taylor.png`}
          />
          <RoundCard title={`MDPI`} src={`/media/publishers/mdpi.png`} />
          <RoundCard
            title={`Frontier Media`}
            src={`/media/publishers/frontier.png`}
          />
          <RoundCard
            title={`BioMed central`}
            src={`/media/publishers/biomed.png`}
          />
          <RoundCard title={`Hindawi`} src={`/media/publishers/hindawi.png`} />
          <RoundCard
            title={`Bentham Open`}
            src={`/media/publishers/bentham.png`}
          />
          <RoundCard
            title={`De Gruyter`}
            src={`/media/publishers/grutyer.png`}
          />
          <RoundCard
            title={`Copernicus publications`}
            src={`/media/publishers/copernicus.png`}
          />
          <RoundCard
            title={`American physical society `}
            src={`/media/publishers/aps.png`}
          />
          <RoundCard
            title={"Scientific research publishing"}
            src={`/media/publishers/srp.png`}
          />
        </div>
      </div>
    </div>
  );
}
