import "./Detail.css";
import DetailCard from "../../researchCard_withGPT/DetailCard";
export default function Detail() {
  return (
    <div className="journal-details m-5 ">
      <div className="detail-img">
        <img
          src="https://www.stonewallco.com/hubfs/Construction%20civil%20engineer%20technician%20and%20architect%20working.png"
          alt=""
        />
      </div>
      <div className="description m-5">
        <p>
          Go to websAIML journal .Go to websAIML journal .Go to websAIML journal
          .Go to websAIML journal .Go to websAIML journal .Go to websAIML
          journal .Go to websAIML journal .Go to websAIML journal .Go to
          websAIML journal .Go to websAIML journal .Go to websAIML journal .Go
          to websAIML journal .Go to websAIML journal
        </p>
      </div>
      <div className="list bg-gray-100">
        <h4 className="text-3xl m-3 ">ALL research papers</h4>
        <div className="detailcard-main">
          <div className="detailcard-container">
            <DetailCard tag={`IEEE `} title={"AIML technologies"} />
            <DetailCard tag={`Springer `} title={"AIML technologies"} />
            <DetailCard tag={`DOAJ `} title={"Civil engineer technologies"} />
            <DetailCard tag={`MDPI `} title={"Mechanicl technologies"} />
            <DetailCard tag={`MDPI `} title={"AIML technologies"} />
            <DetailCard tag={`MDPI `} title={"AIML technologies"} />
            <DetailCard tag={`MDPI `} title={"AIML technologies"} />
            <DetailCard tag={`MDPI `} title={"AIML technologies"} />
            <DetailCard tag={`MDPI `} title={"AIML technologies"} />
            <DetailCard tag={`MDPI `} title={"AIML technologies"} />
          </div>
        </div>
      </div>
    </div>
  );
}
