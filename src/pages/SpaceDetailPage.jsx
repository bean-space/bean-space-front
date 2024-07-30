import { useParams } from "react-router-dom";
import { getSpaceItem, getSpaceReview } from "../api/space";
import SpaceDetailContainer from "../components/SpaceDetailContainer";
import { useEffect, useState } from "react";

const SpaceDetailPage = () => {
  const { spaceId } = useParams();
  const [space, setSpace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchSpaceDetail = async (id) => {
    if (id) {
      const data = await getSpaceItem(id);
      setSpace(data);
    }
  };

  const fetchSpaceReviews = async (id, page) => {
    if (id) {
      const data = await getSpaceReview({ id, page });
      setReviews(data.content);
      setTotalPages(data.totalPages);
    }
  };

  useEffect(() => {
    if (spaceId) {
      fetchSpaceDetail(spaceId);
      fetchSpaceReviews(spaceId, currentPage);
    }
  }, [spaceId, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (!space) return <div>로딩 중</div>;

  return (
    <div style={{ flex: 1, margin: "100px 0 0 0" }}>
      <SpaceDetailContainer
        space={space}
        reviews={reviews}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default SpaceDetailPage;
