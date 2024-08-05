import { useState, ChangeEvent, SyntheticEvent } from "react";

interface Props {
  onSearchSubmit: (e: SyntheticEvent) => void;
  search: string | undefined;
  handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Search = ({ onSearchSubmit, handleSearchChange, search }: Props) => {
  return (
    <form onSubmit={onSearchSubmit}>
      {/* we don't need to use the complete arrow function form unless we have a good reason. 
        It's less efficient as it creates a new function in every render */}
      <input value={search} onChange={handleSearchChange}></input>
      <button type="submit"> Submit </button>
    </form>
  );
};

export default Search;
