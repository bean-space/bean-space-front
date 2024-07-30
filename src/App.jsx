import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import MainPage from "./pages/MainPage";
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AuthCallback from "./components/AuthCallback";
import SearchResultPage from "./pages/SearchResultPage";
import SpaceDetailPage from "./pages/SpaceDetailPage";
import ReservationPage from "./pages/ReservationPage";
import MyReservationPage from "./pages/MyReservationPage";
import CreateCouponPage from "./pages/CreateCouponPage";
import SpaceApprovalPage from "./pages/SpaceApprovalPage";
import HostReservationPage from "./pages/HostReservationPage";
import HostSpacePage from "./pages/HostSpacePage";
import HostStatisticsPage from "./pages/HostStatisticsPage";
import HostSpaceRegisterPage from "./pages/HostSpaceRegisterPage";
import MyProfilePage from "./pages/MyProfilePage";
import MyCouponPage from "./pages/MyCouponPage";
import MyWishListPage from "./pages/MyWishListPage";
import HostSpaceEditPage from "./pages/HostSpaceEditPage";
import CouponPage from "./pages/CouponPage";

const App = () => {
  return (
    <AuthProvider>
      <SearchProvider>
        <BrowserRouter>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/oauth2/login/callback" element={<AuthCallback />} />
              <Route path="/space/search" element={<SearchResultPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/coupon" element={<CouponPage />} />
              <Route path="/space/:spaceId" element={<SpaceDetailPage />} />
              <Route path="/reservation" element={<ReservationPage />} />
              <Route path="/my-reservation" element={<MyReservationPage />} />
              <Route path="/my-profile" element={<MyProfilePage />} />
              <Route path="/wishlist" element={<MyWishListPage />} />
              <Route path="/my-coupon" element={<MyCouponPage />} />
              <Route path="/admin/space" element={<SpaceApprovalPage />} />
              <Route path="/admin/coupon" element={<CreateCouponPage />} />
              <Route
                path="/host/reservation"
                element={<HostReservationPage />}
              />
              <Route path="/host/space" element={<HostSpacePage />} />
              <Route
                path="/host/space/edit/:id"
                element={<HostSpaceEditPage />}
              />
              <Route
                path="/host/space/register"
                element={<HostSpaceRegisterPage />}
              />
              <Route path="/host/statistics" element={<HostStatisticsPage />} />
            </Routes>
          </main>
        </BrowserRouter>
      </SearchProvider>
    </AuthProvider>
  );
};

export default App;
