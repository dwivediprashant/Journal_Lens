import Search from "../../Search/Search";
import Card from "../../Card/Card";
import "./Journals.css";
export default function Journals() {
  return (
    <div className="journals-container">
      <div className="p-5 ">
        <Search placeholder={`Search here...`} />
      </div>
      <div className="journals">
        <Card
          desc="This is AIML journal"
          headerColor="bg-green-300"
          src={`https://biblioteca.cuc.edu.co/wp-content/uploads/2022/09/49.png`}
        />
        <Card
          desc="This is Civil journal"
          headerColor="bg-red-300"
          src={`https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/IEEE_logo.svg/1280px-IEEE_logo.svg.png`}
        />
        <Card
          desc="This is Mechanical journal"
          headerColor="bg-yellow-300"
          src={`https://bg.uek.krakow.pl/otwarta-nauka/wp-content/uploads/2015/03/elsevier.jpg`}
        />
        <Card
          desc="This is AIML journal"
          headerColor="bg-green-300"
          src={`https://biblioteca.cuc.edu.co/wp-content/uploads/2022/09/49.png`}
        />
        <Card
          desc="This is Civil journal"
          headerColor="bg-red-300"
          src={`https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/IEEE_logo.svg/1280px-IEEE_logo.svg.png`}
        />
        <Card
          desc="This is Mechanical journal"
          headerColor="bg-yellow-300"
          src={`https://bg.uek.krakow.pl/otwarta-nauka/wp-content/uploads/2015/03/elsevier.jpg`}
        />
        <Card
          desc="This is AIML journal"
          headerColor="bg-green-300"
          src={`https://biblioteca.cuc.edu.co/wp-content/uploads/2022/09/49.png`}
        />
        <Card
          desc="This is Civil journal"
          headerColor="bg-red-300"
          src={`https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/IEEE_logo.svg/1280px-IEEE_logo.svg.png`}
        />
        <Card
          desc="This is Mechanical journal"
          headerColor="bg-yellow-300"
          src={`https://bg.uek.krakow.pl/otwarta-nauka/wp-content/uploads/2015/03/elsevier.jpg`}
        />
        {/* <Card
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
        <Card
          title="Proceedings of the IEEE"
          desc="desc-3"
          headerColor="bg-blue-400"
          bodyColor="bg-blue-200"
          src={`https://biblioteca.cuc.edu.co/wp-content/uploads/2022/09/49.png`}
        />
        <Card
          title="Proceedings of the IEEE"
          desc="desc-3"
          headerColor="bg-blue-400"
          bodyColor="bg-blue-200"
          src={`https://biblioteca.cuc.edu.co/wp-content/uploads/2022/09/49.png`}
        />
        <Card
          title="Proceedings of the IEEE"
          desc="desc-3"
          headerColor="bg-blue-400"
          bodyColor="bg-blue-200"
          src={`https://biblioteca.cuc.edu.co/wp-content/uploads/2022/09/49.png`}
        />
        <Card
          title="Proceedings of the IEEE"
          desc="desc-3"
          headerColor="bg-blue-400"
          bodyColor="bg-blue-200"
          src={`https://biblioteca.cuc.edu.co/wp-content/uploads/2022/09/49.png`}
        />
        <Card
          title="Proceedings of the IEEE"
          desc="desc-3"
          headerColor="bg-blue-400"
          bodyColor="bg-blue-200"
          src={`https://biblioteca.cuc.edu.co/wp-content/uploads/2022/09/49.png`}
        /> */}
      </div>
    </div>
  );
}
