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
          <RoundCard
            id={`P4310311226`}
            title={`SciELO`}
            src={`/media/publishers/scielo.png`}
          />
          <RoundCard
            id={`P4310320017`}
            title={`IOP Publishing`}
            src={`/media/publishers/iop.png`}
          />
          <RoundCard
            id={`P4310314144`}
            title={"Directory of Open Access Journals"}
            src={`/media/publishers/doaj.png`}
          />
          <RoundCard
            id={`P4310311102`}
            title={"Public Library of Science"}
            src={`/media/publishers/plos.png`}
          />
          <RoundCard
            id={`P4310320990`}
            title={`Elsevier`}
            src={`/media/publishers/elsevier.png`}
          />
          <RoundCard
            id={`P4310319808`}
            title={`IEEE`}
            src={`/media/publishers/ieee.png`}
          />
          <RoundCard
            id={`P4310319965`}
            title={`Springer`}
            src={`/media/publishers/springer.png`}
          />
          <RoundCard
            id={`P4310320595`}
            title={`Wiley`}
            src={`/media/publishers/wiley.png`}
          />

          <RoundCard
            id={`P4310320010`}
            title={`SAGE Publishing`}
            src={`/media/publishers/sage.png`}
          />
          <RoundCard
            id={`P4310319847`}
            title={`Taylor & Francis`}
            src={`/media/publishers/taylor.png`}
          />
          <RoundCard
            id={`P4310310987`}
            title={`MDPI`}
            src={`/media/publishers/mdpi.png`}
          />
          <RoundCard
            id={`P4310320503`}
            title={`Frontiers Media`}
            src={`/media/publishers/frontier.png`}
          />
          <RoundCard
            id={`P4310319974`}
            title={`BioMed central`}
            src={`/media/publishers/biomed.png`}
          />
          <RoundCard
            id={`P4310319869`}
            title={`Hindawi`}
            src={`/media/publishers/hindawi.png`}
          />
          <RoundCard
            id={`P4310320292`}
            title={`Bentham Open`}
            src={`/media/publishers/bentham.png`}
          />
          <RoundCard
            id={`P4310320432`}
            title={`De Gruyter`}
            src={`/media/publishers/grutyer.png`}
          />
          <RoundCard
            id={`P4310311451`}
            title={`Copernicus publications`}
            src={`/media/publishers/copernicus.png`}
          />
          <RoundCard
            id={`P4310320309`}
            title={`American physical society `}
            src={`/media/publishers/aps.png`}
          />
          <RoundCard
            id={`P4310320147`}
            title={"Scientific research publishing"}
            src={`/media/publishers/srp.png`}
          />
        </div>
      </div>
    </div>
  );
}
