import Search from "../../Search/Search";
import Card from "../../Card/Card";
import "./Journals.css";
import journalData from "./JournalsData";
import { useState } from "react";
import { useNavigate } from "react-router";
import { v4 as uuidv4 } from "uuid";

export default function Journals() {
  const [searchVal, setSearchVal] = useState("");

  const searchedJournals = journalData.filter((card) =>
    card.field.toLocaleLowerCase().includes(searchVal.toLocaleLowerCase()),
  );

  // navigate user to custom journals route when no results found
  const navigate = useNavigate();
  const handleFallBackClick = () => {
    const id = uuidv4();
    navigate(`/journals/${id}/custom`);
  };

  return (
    <div className="journals-container">
      <div className="search-wrap p-2 ">
        <div className="w-[50%] flex">
          <input
            type="text"
            placeholder="Search by field names medicine, law ..."
            className="border outline-none px-4 w-[100%]"
            onChange={(e) => setSearchVal(e.target.value)}
            value={searchVal}
          />
          <div className="bg-blue-800 text-white">
            <i className="fa-solid fa-magnifying-glass m-5"></i>
          </div>
        </div>
      </div>
      <div className="journals-wrapper">
        <div className="journals mt-5">
          {searchVal && searchVal.length > 0 ? (
            searchedJournals.length > 0 ? (
              searchedJournals.map((card) => (
                <Card
                  key={card.id}
                  field={card.field}
                  id={card.id}
                  desc={card.desc}
                  src={card.src}
                />
              ))
            ) : (
              <div className="flex flex-col items-center  w-[100%] h-[40vh]">
                <div>
                  <img
                    src="/media/fields/thinking.png"
                    alt=""
                    className="fallback-img"
                  />
                </div>
                <div className="text-red-700 m-5">
                  Ohh! No field matched with your search
                </div>
                <button
                  onClick={handleFallBackClick}
                  className="cursor-pointer p-2 rounded-lg bg-black text-white w-[max-content] hover:opacity-[0.8]"
                >
                  Search with own field
                </button>
              </div>
            )
          ) : (
            journalData.map((card) => (
              <Card
                key={card.id}
                field={card.field}
                id={card.id}
                desc={card.desc}
                src={card.src}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
