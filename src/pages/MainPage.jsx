import CouponBanner from "../components/CouponBanner";
import MainPageSpaceList from "../components/MainPageSpaceList";
import SearchBar from "../components/SearchBar";

const MainPage = () => {
  return (
    <div style={{ margin: "100px 0 0 0" }}>
      <CouponBanner />
      <SearchBar />
      <MainPageSpaceList />
    </div>
  );
};

export default MainPage;
