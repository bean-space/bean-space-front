import { addDays } from "date-fns";
import CouponBanner from "../components/CouponBanner";
import MainPageSpaceList from "../components/MainPageSpaceList";
import SearchBar from "../components/SearchBar";
import { useSearch } from "../hooks/useSearch";
import { useEffect } from "react";

const MainPage = () => {
  const { setSearchState } = useSearch();

  useEffect(() => {
    const tomorrow = addDays(new Date(), 1);
    const dayAfterTomorrow = addDays(new Date(), 2);
    setSearchState({
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
  }, [setSearchState]);

  return (
    <div style={{ margin: "100px 0 0 0" }}>
      <CouponBanner />
      <SearchBar />
      <MainPageSpaceList />
    </div>
  );
};

export default MainPage;
