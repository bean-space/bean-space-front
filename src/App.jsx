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
import AdminSpaceApprovalPage from "./pages/AdminSpaceApprovalPage";
import HostReservationPage from "./pages/HostReservationPage";
import HostSpacePage from "./pages/HostSpacePage";
import HostStatisticsPage from "./pages/HostStatisticsPage";
import HostSpaceRegisterPage from "./pages/HostSpaceRegisterPage";
import MyProfilePage from "./pages/MyProfilePage";
import MyCouponPage from "./pages/MyCouponPage";
import MyWishListPage from "./pages/MyWishListPage";
import HostSpaceEditPage from "./pages/HostSpaceEditPage";
import CouponPage from "./pages/CouponPage";
import AdminCouponPage from "./pages/AdminCouponPage";
import WriteSpaceReviewPage from "./pages/WriteSpaceReviewPage";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/ko";
import EditCouponPage from "./pages/EditCouponPage";
import NotFoundPage from "./pages/NotFoundPage";
import ApplyToHostPage from "./pages/ApplyToHostPage";
import EditSpaceReviewPage from "./pages/EditSpaceReviewPage";
import SocialUserInfoUpdatePage from "./pages/SocialUserInfoUpdatePage";
import MyProfileEditPage from "./pages/MyProfileEditPage";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");
dayjs.locale("ko");

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
      <AuthProvider>
        <SearchProvider>
          <BrowserRouter>
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<MainPage />} />
                <Route
                  path="/oauth2/login/callback"
                  element={<AuthCallback />}
                />
                <Route path="/space/search" element={<SearchResultPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route
                  path="/social-user-info-update"
                  element={<SocialUserInfoUpdatePage />}
                />
                <Route path="/coupon" element={<CouponPage />} />
                <Route path="/space/:spaceId" element={<SpaceDetailPage />} />
                <Route
                  path="/edit-review/:spaceId/:reviewId"
                  element={<EditSpaceReviewPage />}
                />
                <Route path="/reservation" element={<ReservationPage />} />
                <Route path="/my-reservation" element={<MyReservationPage />} />
                <Route
                  path="/my-reservation/write-review/:spaceId/:reservationId"
                  element={<WriteSpaceReviewPage />}
                />
                <Route path="/my-profile" element={<MyProfilePage />} />
                <Route
                  path="/my-profile/edit"
                  element={<MyProfileEditPage />}
                />
                <Route path="/wishlist" element={<MyWishListPage />} />
                <Route path="/my-coupon" element={<MyCouponPage />} />
                <Route path="/apply-to-host" element={<ApplyToHostPage />} />
                <Route
                  path="/admin/space"
                  element={<AdminSpaceApprovalPage />}
                />
                <Route path="/admin/coupon" element={<AdminCouponPage />} />
                <Route
                  path="/admin/coupon/create"
                  element={<CreateCouponPage />}
                />
                <Route
                  path="/admin/coupon/edit/:id"
                  element={<EditCouponPage />}
                />
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
                <Route
                  path="/host/statistics"
                  element={<HostStatisticsPage />}
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </BrowserRouter>
        </SearchProvider>
      </AuthProvider>
    </LocalizationProvider>
  );
};

export default App;
