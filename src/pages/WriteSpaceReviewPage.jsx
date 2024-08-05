import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addReview } from "../api/space";
import WriteSpaceReviewContainer from "../components/WriteSpaceReviewContainer";
import { getPresignedUrl } from "../api/image";
import axios from "axios";

const WriteSpaceReviewPage = () => {
  const { spaceId, reservationId } = useParams();
  const navigate = useNavigate();
  const [reviewContent, setReviewContent] = useState("");
  const [rating, setRating] = useState(5);
  const [images, setImages] = useState([]);

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

      const reviewData = {
        content: reviewContent,
        rating: rating,
        reservationId,
        imageUrlList: imageUrlList,
      };

      await addReview({ review: reviewData, id: spaceId });
      alert("리뷰가 정상적으로 등록되었습니다");
      navigate(-1);
    } catch (error) {
      if (error.response.data.msg) {
        alert(error.response.data.masg);
      } else {
        alert("리뷰 작성에 실패했습니다");
      }
    }
  };

  return (
    <div style={{ flex: 1, margin: "100px 0 0 0" }}>
      <WriteSpaceReviewContainer
        reservationId={reservationId}
        reviewContent={reviewContent}
        setReviewContent={setReviewContent}
        rating={rating}
        setRating={setRating}
        images={images}
        setImages={setImages}
        handleSubmit={handleSubmit}
      />
      a
    </div>
  );
};

export default WriteSpaceReviewPage;
