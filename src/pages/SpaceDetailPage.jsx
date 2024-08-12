import { useNavigate, useParams } from "react-router-dom";
import { getSpaceItem, getSpaceReview } from "../api/space";
import SpaceDetailContainer from "../components/SpaceDetailContainer";
import { useCallback, useEffect, useState } from "react";

const SpaceDetailPage = () => {
  const { spaceId } = useParams();
  const navigate = useNavigate();
  const [space, setSpace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortOption, setSortOption] = useState(0);

  const getSortParam = useCallback((option) => {
    switch (option) {
      case 0:
        return "createdAt,desc";
      case 1:
        return "rating,desc";
      case 2:
        return "rating,asc";
      default:
        return "createdAt,desc";
    }
  }, []);

  const fetchReviews = useCallback(
    async (page, sort) => {
      try {
        const reviewData = await getSpaceReview({
          id: spaceId,
          page,
          sort: getSortParam(sort),
        });
        setReviews(reviewData.content);
        setTotalPages(reviewData.totalPages);
      } catch (error) {
        if (error.response.data.msg) {
          alert(error.response.data.msg);
        } else {
          alert("리뷰를 불러올 수 없습니다");
        }
      }
    },
    [spaceId, getSortParam]
  );

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
        fetchReviews(currentPage, sortOption);
      } catch (error) {
        alert("존재하지 않는 공간입니다");
        navigate(-1);
      }
    };

    fetchData();
  }, [spaceId, currentPage, sortOption, navigate, fetchReviews]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSortChange = (newSortOption) => {
    setSortOption(newSortOption);
    setCurrentPage(0);
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
        onSortChange={handleSortChange}
      />
    </div>
  );
};

export default SpaceDetailPage;
