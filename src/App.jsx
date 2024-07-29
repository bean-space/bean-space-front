import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import MainPage from "./pages/MainPage";
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AuthCallback from "./components/AuthCallback";
import SearchResultPage from "./pages/SearchResultPage";
import SpaceDetailPage from "./pages/SpaceDetailPage";
import SearchBar from "./components/SearchBar";
import ReservationPage from "./pages/ReservationPage";
import MyReservationPage from "./pages/MyReservationPage";

const SearchLayout = () => (
  <div style={{ margin: "100px 0 0 0" }}>
    <SearchBar />
    <Outlet />
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <SearchProvider>
        <BrowserRouter>
          <Header />
          <main>
            <Routes>
              <Route path="/oauth2/login/callback" element={<AuthCallback />} />
              <Route element={<SearchLayout />}>
                <Route path="/" element={<MainPage />} />
                <Route path="/space/search" element={<SearchResultPage />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/space/:spaceId" element={<SpaceDetailPage />} />
              <Route path="/reservation" element={<ReservationPage />} />
              <Route path="/myreservation" element={<MyReservationPage />} />
            </Routes>
          </main>
        </BrowserRouter>
      </SearchProvider>
    </AuthProvider>
  );
};

export default App;
