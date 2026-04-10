import Search from "../../Search/Search";
import Card from "../../Card/Card";
import "./Journals.css";
import { v4 as uuidv4 } from "uuid";
export default function Journals() {
  return (
    <div className="journals-container">
      <div className="search-wrap p-2 ">
        <div className="w-[50%]">
          <Search placeholder={`Search here...`} />
        </div>
      </div>
      <div className="journals-wrapper">
        <div className="journals mt-5">
          <Card
            id={uuidv4()}
            desc="This is AIML journal .This is AIML journal .This is AIML journal .This is AIML journal .This is AIML journal .This is AIML journal .This is AIML journal .This is AIML journal .This is AIML journal .This is AIML journal .This is AIML journal .This is AIML journal .This is AIML journal ."
            src={`https://5.imimg.com/data5/SELLER/Default/2025/6/522977434/JB/FG/PV/5675130/aiml-deep-learning-service.png`}
          />
          <Card
            id={uuidv4()}
            desc="This is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journal"
            src={`https://www.stonewallco.com/hubfs/Construction%20civil%20engineer%20technician%20and%20architect%20working.png`}
          />
          <Card
            id={uuidv4()}
            desc="This is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journal"
            src={`https://i.ytimg.com/vi/3tisOnOkwzo/maxresdefault.jpg`}
          />
          <Card
            id={uuidv4()}
            desc={`This is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journalThis is Civil journal`}
            src={`https://jrnrvu.edu.in/wp-content/uploads/2024/11/covering_gis_rs.png`}
          />
          <Card
            id={uuidv4()}
            desc="This is Mechanical journal. vThis is Mechanical journaThis is Mechanical journaThis is Mechanical journaThis is Mechanical journaThis is Mechanical journaThis is Mechanical journavv This is Mechanical journaThis is Mechanical journaThis is Mechanical journa"
            src={`https://www.mckissock.com/wp-content/uploads/2025/02/mechanical-engineer.jpg`}
          />
          <Card
            id={uuidv4()}
            desc="This is Mechanical journal. vThis is Mechanical journaThis is Mechanical journaThis is Mechanical journaThis is Mechanical journaThis is Mechanical journaThis is Mechanical journavv This is Mechanical journaThis is Mechanical journaThis is Mechanical journa"
            src={`https://nationalaffairs.com/storage/app/resized/3b5/0ba/e52/Hartman_resized_3b50bae525a0892cff72f08875f034ff52e2e295.jpg`}
          />
          <Card
            id={uuidv4()}
            desc="This is Mechanical journal. vThis is Mechanical journaThis is Mechanical journaThis is Mechanical journaThis is Mechanical journaThis is Mechanical journaThis is Mechanical journavv This is Mechanical journaThis is Mechanical journaThis is Mechanical journa"
            src={`https://www.agsdevices.com/wp-content/uploads/2024/08/types-of-circuits-hero-image.jpg`}
          />
        </div>
      </div>
    </div>
  );
}
