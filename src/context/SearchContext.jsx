import { createContext, useState } from "react";
import { addDays } from "date-fns";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const tomorrow = addDays(new Date(), 1);
  const dayAfterTomorrow = addDays(new Date(), 2);

  const [searchState, setSearchState] = useState({
    searchSido: "전체",
    peopleCount: 1,
    dateRange: {
      startDate: tomorrow,
      endDate: dayAfterTomorrow,
      key: "selection",
    },
  });

  return (
    <SearchContext.Provider value={{ searchState, setSearchState }}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
