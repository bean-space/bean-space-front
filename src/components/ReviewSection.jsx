import {
  Box,
  Typography,
  Divider,
  Avatar,
  Rating,
  Paper,
  Pagination,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import defaultProfile from "../assets/default_profile_image.webp";
import { useAuth } from "../hooks/useAuth";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import { useState } from "react";

const Review = ({ review, onEdit, onDelete }) => {
  const { id } = useAuth();

  return (
    <Box mb={3}>
      <Box display="flex" alignItems="center" mb={1}>
        <Avatar
          src={review.reviewerProfileUrl || defaultProfile}
          alt={review.reviewerName}
        />
        <Box ml={2}>
          <Typography variant="subtitle1">{review.reviewerName}</Typography>
          <Typography variant="body2" color="text.secondary">
            {(() => {
              const date = new Date(review.createdAt);
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");
              const hours = String(date.getHours()).padStart(2, "0");
              const minutes = String(date.getMinutes()).padStart(2, "0");

              return `${year}-${month}-${day} ${hours}시 ${minutes}분`;
            })()}
          </Typography>
        </Box>
        <Box ml="auto">
          <Rating value={review.rating} readOnly size="small" />
        </Box>
      </Box>
      <Typography variant="body1" sx={{ mt: 2 }}>
        {review.content}
      </Typography>
      {review.imageUrlList &&
        review.imageUrlList.length > 0 &&
        review.imageUrlList[0] !== "" && (
          <Box
            sx={{
              width: "80%",
              margin: "5px auto",
              mb: 3,
              mt: 3,
            }}
          >
            <Carousel
              indicators={true}
              indicatorContainerProps={{
                style: {
                  position: "absolute",
                  bottom: "20px",
                  zIndex: 1,
                  marginTop: 0,
                },
              }}
            >
              {review.imageUrlList.map((imageUrl, index) => (
                <Paper
                  className="mainImg"
                  key={index}
                  sx={{
                    height: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundImage: `url(${imageUrl})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }}
                    alt="Review Image"
                  />
                </Paper>
              ))}
            </Carousel>
          </Box>
        )}
      {id === review.reviewerId && (
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button
            onClick={() => onEdit(review)}
            sx={{
              mr: 1,
              border: "1px solid #2AAADE",
              color: "#2AAADE",
              "&:hover": {
                backgroundColor: "#1976D20A",
              },
            }}
            startIcon={<EditTwoToneIcon />}
            variant="outlined"
          >
            수정
          </Button>
          <Button
            onClick={() => onDelete(review.id)}
            sx={{
              border: "1px solid #d32f2f",
              color: "#d32f2f",
              "&:hover": {
                backgroundColor: "#D32F2F0A",
              },
            }}
            startIcon={<DeleteForeverTwoToneIcon />}
            variant="outlined"
            color="error"
          >
            삭제
          </Button>
        </Box>
      )}
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
};

const ReviewSection = ({
  reviews,
  currentPage,
  totalPages,
  onPageChange,
  onEditReview,
  onDeleteReview,
  onSortChange,
}) => {
  const [sortOption, setSortOption] = useState(0);

  const handleChange = (event, value) => {
    onPageChange(value - 1);
  };

  const handleSortChange = (event, newValue) => {
    setSortOption(newValue);
    onSortChange(newValue);
  };

  return (
    <Box mt={4}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          background:
            "linear-gradient(30deg, rgba(97,92,185,1) 0%, rgba(57,207,203,1) 48%, rgba(135,206,235,1) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        color="neutral"
        gutterBottom
      >
        숙소 이용자들이 남긴 리얼 후기
      </Typography>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          mb: 2,
        }}
      >
        <Tabs
          value={sortOption}
          onChange={handleSortChange}
          sx={{
            mr: 5,
            "& .Mui-selected": {
              color: "#2AAADE",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#2AAADE",
            },
          }}
        >
          <Tab label="최근 작성 순" />
          <Tab label="별점 높은 순" />
          <Tab label="별점 낮은 순" />
        </Tabs>
      </Box>
      <Divider sx={{ my: 3 }} />
      {reviews.length > 0 ? (
        <>
          {reviews.map((review, index) => (
            <Review
              key={index}
              review={review}
              onEdit={onEditReview}
              onDelete={onDeleteReview}
            />
          ))}
          <Box display="flex" justifyContent="center" mt={3} mb={2}>
            <Pagination
              count={totalPages}
              page={currentPage + 1}
              onChange={handleChange}
              color="primary"
            />
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100px"
        >
          <Typography variant="h7" color="text.secondary">
            아직 등록된 후기가 없습니다.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ReviewSection;
