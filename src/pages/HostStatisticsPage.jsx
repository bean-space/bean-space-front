import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import HostStatisticsContainer from "../components/HostStatisticsContainer";

const HostStatisticsPage = () => {
  const { role, isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoading && (!isLoggedIn || role !== "HOST")) {
      alert("호스트만 접근할 수 있는 페이지입니다.");
      navigate("/");
    }
  }, [isLoading, isLoggedIn, role, navigate]);

  if (!isLoggedIn || role !== "HOST" || isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div style={{ flex: 1, margin: "100px 0 0 0" }}>
      <HostStatisticsContainer />
    </div>
  );
};

export default HostStatisticsPage;
