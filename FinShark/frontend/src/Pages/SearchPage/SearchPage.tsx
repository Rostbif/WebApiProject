import { ChangeEvent, SyntheticEvent, useState } from "react";
import CardList from "../../Components/CardList/CardList";
import Hero from "../../Components/Hero/Hero";
import Navbar from "../../Components/Navbar/Navbar";
import ListPortfolio from "../../Components/Portfolio/ListPortfolio/ListPortfolio";
import Search from "../../Components/Search/Search";
import { CompanySearch } from "../../company";
import { searchCompanies } from "../../api";
import Spinner from "../../Components/Spinners/Spinner";

interface Props {}

const SearchPage = (props: Props) => {
  const [search, setSearch] = useState("");
  const [portfolioValues, setPortfolioValues] = useState<string[]>([]);
  const [searchResult, setSearchResult] = useState<CompanySearch[]>([]);
  const [serverError, setServerError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // I can use here also SyntheticEvent
  const onSearchSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await searchCompanies(search);
    if (typeof result === "string") {
      setServerError(result);
    } else if (Array.isArray(result.data)) {
      setSearchResult(result.data);
      setServerError("");
      setIsLoading(false);
      // clearing the error if there was one
    }
    console.log(searchResult);
  };

  const onPortfolioCreate = (e: any) => {
    e.preventDefault();
    // make sure this e.target[0].value is not included yet in the Portfolio
    // I could use -> some(), includes(), find() with the same complexity.
    if (!portfolioValues.includes(e.target[0].value)) {
      const updatedPortfolio = [...portfolioValues, e.target[0].value];
      setPortfolioValues(updatedPortfolio);
      setServerError("");
    } else {
      setServerError("Already exist in portfolio");
    }
  };

  const onPortfolioDelete = (e: any) => {
    e.preventDefault();
    const updatedPortfolio = portfolioValues.filter(
      (p) => p !== e.target[0].value
    );
    setPortfolioValues(updatedPortfolio);
  };

  return (
    <div className="App">
      {/* <Hero /> */}
      <Search
        onSearchSubmit={onSearchSubmit}
        handleSearchChange={handleSearchChange}
        search={search}
      />
      <ListPortfolio
        portfolioValues={portfolioValues}
        onPortfolioDelete={onPortfolioDelete}
      />
      <CardList
        searchResult={searchResult}
        onPortfolioCreate={onPortfolioCreate}
      />
      {isLoading && <Spinner />}
      {serverError && <h1>{serverError}</h1>}
    </div>
  );
};

export default SearchPage;
