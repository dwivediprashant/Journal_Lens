import Card from "../Card/Card";
import "./Hero.css";

export default function Hero() {
  return (
    <div>
      <div className="flex justify-between m-5">
        <div className="left m-5 p-5">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
            sunt autem asperiores exercitationem cum cumque, ducimus maxime
            architecto, qui saepe, officiis laudantium? Officia natus labore,
            ipsam ut tempore optio? Eligendi.Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Voluptatum sunt autem asperiores
            exercitationem cum cumque, ducimus maxime architecto, qui saepe,
            officiis laudantium? Officia natus labore, ipsam ut tempore optio?
            Eligendi.Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptatum sunt autem asperiores exercitationem cum cumque, ducimus
            maxime architecto, qui saepe, officiis laudantium? Officia natus
            labore, ipsam ut tempore optio? Eligendi.
          </p>
          <button className=" text-white p-3 rounded-xl m-5">
            Explore journals
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
        <Card
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
        />
      </div>
    </div>
  );
}
