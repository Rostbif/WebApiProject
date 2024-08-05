import { SyntheticEvent } from "react";
import { CompanySearch } from "../../company";
import AddPortfolio from "../Portfolio/AddPortfolio/AddPortfolio";
import "./Card.css";

interface Props {
  id: string;
  searchResult: CompanySearch;
  onPortfolioCreate: (e: SyntheticEvent) => void;
}

const Card = ({ id, searchResult, onPortfolioCreate }: Props) => {
  return (
    // not sure that we need the id here...
    <div key={id} id={id} className="card">
      {searchResult.symbol}
      <div className="details">
        <img
          src="https://media.licdn.com/dms/image/C5603AQFer4MgjR4H3g/profile-displayphoto-shrink_800_800/0/1604240402500?e=1728518400&v=beta&t=95rCukFiO3Rp4QPnS1EeWrAxbl366UyhGSGKSYT-Y70"
          alt="Company Logo"
          style={{
            color: "red",
            borderRadius: "50%",
            width: "200px",
            height: "200px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.19)",
          }}
        />
        <h2>{searchResult.name}</h2>
        <p> ${searchResult.currency} </p>
      </div>
      <p className="info">
        {searchResult.exchangeShortName} - {searchResult.stockExchange}
      </p>
      <AddPortfolio
        onPortfolioCreate={onPortfolioCreate}
        symbol={searchResult.symbol}
      />
    </div>
  );
};
export default Card;
