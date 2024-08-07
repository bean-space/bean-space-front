import { useNavigate, useParams } from "react-router-dom";
import { getSpaceItem, getSpaceReview } from "../api/space";
import SpaceDetailContainer from "../components/SpaceDetailContainer";
import { useEffect, useState } from "react";

const SpaceDetailPage = () => {
  const { spaceId } = useParams();
  const navigate = useNavigate();
  const [space, setSpace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!spaceId) {
      alert("존재하지 않는 페이지입니다");
      navigate(-1);
      return;
    }

    const fetchData = async () => {
      try {
        const spaceData = await getSpaceItem(spaceId);
        setSpace(spaceData);
        const reviewData = await getSpaceReview({
          id: spaceId,
          page: currentPage,
        });
        setReviews(reviewData.content);
        setTotalPages(reviewData.totalPages);
      } catch (error) {
        alert("존재하지 않는 공간입니다");
        navigate(-1);
      }
    };

    fetchData();
  }, [spaceId, currentPage, navigate]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (!space) return null;

  return (
    <div style={{ flex: 1, margin: "100px 0 0 0" }}>
      <SpaceDetailContainer
        space={space}
        reviews={reviews}
        setReviews={setReviews}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default SpaceDetailPage;
