import { SyntheticEvent } from "react";
import { CompanySearch } from "../../company";
import Card from "../Card/Card";
import "./CardList.css";
import { v4 as uuidv4 } from "uuid";

interface Props {
  searchResult: CompanySearch[];
  onPortfolioCreate: (e: SyntheticEvent) => void;
}

const CardList = ({ searchResult, onPortfolioCreate }: Props) => {
  return (
    <div className="cardListContainer">
      {searchResult.length > 0 ? (
        searchResult.map((s) => (
          <Card
            id={s.symbol}
            // I could use here the symbol. I don't think the uuid usage is optimal
            key={uuidv4()}
            searchResult={s}
            onPortfolioCreate={onPortfolioCreate}
          />
        ))
      ) : (
        <h1> No result! </h1>
      )}
    </div>
  );
};

export default CardList;
