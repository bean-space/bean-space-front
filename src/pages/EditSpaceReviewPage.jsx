import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { updateReview } from "../api/space";
import WriteSpaceReviewContainer from "../components/WriteSpaceReviewContainer";
import { getPresignedUrl } from "../api/image";
import axios from "axios";

const EditSpaceReviewPage = () => {
  const { spaceId, reviewId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const reviewData = location.state?.review;
  const refreshReviews = location.state?.refreshReviews;

  const [reviewContent, setReviewContent] = useState(reviewData?.content || "");
  const [rating, setRating] = useState(reviewData?.rating || 5);
  const [images, setImages] = useState(
    reviewData?.imageUrlList.map((url) => ({ url })) || []
  );

  useEffect(() => {
    if (!reviewData) {
      alert("리뷰 데이터를 불러올 수 없습니다.");
      navigate(-1);
    }
  }, [reviewData, navigate]);

  const uploadImages = async () => {
    const uploadedUrls = [];
    for (let image of images) {
      if (image.file) {
        try {
          const presignedUrl = await getPresignedUrl({
            fileName: image.file.name,
            contentType: image.file.type,
            imageType: "REVIEW",
          });

          await axios.put(presignedUrl, image.file, {
            headers: {
              "Content-Type": image.file.type,
            },
          });

          const uploadedUrl = presignedUrl.split("?")[0];
          uploadedUrls.push(uploadedUrl);
        } catch (error) {
          alert("이미지 업로드에 실패하였습니다");
          throw error;
        }
      } else if (image.url) {
        uploadedUrls.push(image.url);
      }
    }
    return uploadedUrls;
  };

  const handleSubmit = async () => {
    if (reviewContent.trim().length < 10) {
      alert("리뷰는 최소 10자 이상 입력해야합니다");
      return;
    }

    try {
      const imageUrlList = await uploadImages();

      const updatedReviewData = {
        content: reviewContent,
        rating: rating,
        imageUrlList: imageUrlList,
      };

      await updateReview({ review: updatedReviewData, spaceId, reviewId });
      alert("리뷰가 정상적으로 수정되었습니다");
      if (refreshReviews) {
        refreshReviews();
      }
      navigate(`/space/${spaceId}`);
    } catch (error) {
      if (error.response.data.msg) {
        alert(error.response.data.msg);
      } else {
        alert("리뷰 수정에 실패했습니다");
      }
    }
  };

  if (!reviewData) {
    return null;
  }

  return (
    <div style={{ flex: 1, margin: "100px 0 0 0" }}>
      <WriteSpaceReviewContainer
        reviewContent={reviewContent}
        setReviewContent={setReviewContent}
        rating={rating}
        setRating={setRating}
        images={images}
        setImages={setImages}
        handleSubmit={handleSubmit}
        isEditing={true}
      />
    </div>
  );
};

export default EditSpaceReviewPage;
