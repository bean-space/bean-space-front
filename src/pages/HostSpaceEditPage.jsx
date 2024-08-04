import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import HostSpaceFormContainer from "../components/HostSpaceFormContainer";
import { getSpaceItem } from "../api/space";
import { useAuth } from "../hooks/useAuth";

const HostSpaceEditPage = () => {
  const { role, isLoggedIn } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [spaceData, setSpaceData] = useState(null);

  useEffect(() => {
    const fetchSpaceData = async () => {
      if (location.state && location.state.spaceData) {
        setSpaceData(location.state.spaceData);
      } else {
        try {
          const data = await getSpaceItem(id);
          setSpaceData(data);
        } catch (error) {
          alert("공간 정보를 불러오는데 실패했습니다.");
          navigate("/host/space");
        }
      }
    };

    fetchSpaceData();
  }, [id, location.state, navigate]);

  useEffect(() => {
    if (!isLoggedIn || role !== "HOST") {
      alert("호스트만 접근할 수 있는 페이지입니다.");
      navigate("/");
    }
  }, [isLoggedIn, role, navigate]);

  if (!spaceData) {
    return <div>로딩 중...</div>;
  }

  return (
    <div style={{ flex: 1, margin: "100px 0 0 0" }}>
      <HostSpaceFormContainer isEdit={true} initialData={spaceData} />
    </div>
  );
};

export default HostSpaceEditPage;
