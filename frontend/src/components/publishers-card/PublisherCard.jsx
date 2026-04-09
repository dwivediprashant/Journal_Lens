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
      <div className="round-card-wrapper">
        <div className="round-card-container">
          <RoundCard
            title={`SciELO`}
            src={`https://pkp.sfu.ca/wp-content/uploads/2022/11/logo-SciELO.png`}
          />
          <RoundCard
            title={`IOP Publishing`}
            src={`https://publishingsupport.iopscience.iop.org/wp-content/uploads/2021/10/IOP.png`}
          />
          <RoundCard
            title={"Directory of Open Access Journals"}
            src={`https://i.ytimg.com/vi/ndvLm9MIfKA/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AH-CYAC0AWKAgwIABABGHIgWig9MA8=&rs=AOn4CLCGqHA9WHpiHh5m5wQBtx6vB8PHpg`}
          />
          <RoundCard
            title={"Public Library of Science"}
            src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqT073lKVHqbZ0z62wUrelUUk8ghjhqTgJKA&s`}
          />
          <RoundCard
            title={`Elsevier`}
            src={`https://bg.uek.krakow.pl/otwarta-nauka/wp-content/uploads/2015/03/elsevier.jpg`}
          />
          <RoundCard
            title={`IEEE`}
            src={`https://ess.ieee.org.ua/wp-content/uploads/2016/05/ieee_img.jpg__1320x740_q95_crop_subsampling-2_upscale-1024x574.jpg`}
          />
          <RoundCard
            title={`Springer`}
            src={`https://biblioteca.cuc.edu.co/wp-content/uploads/2022/09/49.png`}
          />
          <RoundCard
            title={`Wiley`}
            src={`https://cdn-images-1.medium.com/max/800/1*8o7pAjGue9jRyxgZgcAqOA.png`}
          />

          <RoundCard
            title={`SAGE Publishing`}
            src={`https://www.stm-publishing.com/wp-content/uploads/2023/11/Sage.jpg`}
          />
          <RoundCard
            title={`Taylor & Francis`}
            src={`https://www.eifl.net/sites/default/files/styles/resources_detail_page/public/tf_0.jpg?itok=f6dQZjps`}
          />
          <RoundCard
            title={`MDPI`}
            src={`https://www.bnos.org.uk/wp-content/uploads/2021/09/MDPI_LOGO_print.png`}
          />
          <RoundCard
            title={`Frontier Media`}
            src={`https://frontiers.media/wp-content/uploads/2015/10/logo-positive-scaled.jpg`}
          />
          <RoundCard
            title={`BioMed central`}
            src={`https://media.licdn.com/dms/image/v2/D4D22AQEON1pdIBDE9g/feedshare-shrink_800/B4DZh1yT12H4Ak-/0/1754322780385?e=2147483647&v=beta&t=81dIOMtivMmtG8v4J7kKKIqiPUQGbCnkIQd0Sd2PJTg`}
          />
          <RoundCard
            title={`Hindawi`}
            src={`https://mma.prnewswire.com/media/1843453/Hindawi_Logo.jpg?p=facebook`}
          />
          <RoundCard
            title={`Bentham Open`}
            src={`https://i.ytimg.com/vi/e0_phuCH3L0/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBF5itVKT3HFa85-9z0OjiVuk1aCQ`}
          />
          <RoundCard
            title={`De Gruyter`}
            src={`https://cpd-storage.lon1.digitaloceanspaces.com/app/public/1212/53fVoquN_400x400.jpg`}
          />
          <RoundCard
            title={`Copernicus publications`}
            src={`https://www.copernicus.eu/sites/default/files/styles/image_img_fluid/public/images/media/low/295955-Copernicus_logo_node_full_image_2.jpg?itok=rxBru8V4`}
          />
          <RoundCard
            title={`American physical society `}
            src={`https://cdn.journals.aps.org/test/5505baba-543d-4503-98ab-11e47cee3508/Journal-Club-400x200.png`}
          />
          <RoundCard
            title={"Scientific research publishing"}
            src={`https://d13i5xhouzkrd.cloudfront.net/assets/publisher-colored-logos/logo-scientific-research-publishing.png`}
          />
        </div>
      </div>
    </div>
  );
}
