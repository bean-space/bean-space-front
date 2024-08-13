import { createContext, useState } from "react";
import { addDays } from "date-fns";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const tomorrow = addDays(new Date(), 1);
  const dayAfterTomorrow = addDays(new Date(), 2);

  const [searchState, setSearchState] = useState({
    searchKeyword: "",
    peopleCount: 1,
    dateRange: {
      startDate: tomorrow,
      endDate: dayAfterTomorrow,
      key: "selection",
    },
    minPrice: 0,
    maxPrice: 500000,
    offers: [],
    bedrooms: 0,
    beds: 0,
    bathrooms: 0,
    sortOption: 0,
  });

  const updateSearchState = (newState) => {
    setSearchState((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };

  return (
    <SearchContext.Provider
      value={{ searchState, updateSearchState, setSearchState }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
