import { useParams } from "react-router-dom";
import { getSpaceItem } from "../api/space";
import SpaceDetailContainer from "../components/SpaceDetailContainer";
import { useEffect, useState } from "react";

const SpaceDetailPage = () => {
  const { spaceId } = useParams();
  const [space, setSpace] = useState(null);

  const fetchSpaceDetail = async (id) => {
    if (id) {
      const data = await getSpaceItem(id);
      setSpace(data);
    }
  };

  useEffect(() => {
    if (spaceId) {
      fetchSpaceDetail(spaceId);
    }
  }, [spaceId]);

  if (!space) return <div>로딩 중</div>;

  return (
    <div style={{ flex: 1, margin: "100px 0 0 0" }}>
      <SpaceDetailContainer space={space} />
    </div>
  );
};

export default SpaceDetailPage;
