import {
  Box,
  Typography,
  Divider,
  Avatar,
  Rating,
  Paper,
  Pagination,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import defaultProfile from "../assets/default_profile_image.webp";

const Review = ({ review }) => (
  <Box mb={3}>
    <Box display="flex" alignItems="center" mb={1}>
      <Avatar
        src={review.reviewerProfileUrl || defaultProfile}
        alt={review.reviewerName}
      />
      <Box ml={2}>
        <Typography variant="subtitle1">{review.reviewerName}</Typography>
        <Typography variant="body2" color="text.secondary">
          {new Date().toLocaleDateString()}
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

    <Divider sx={{ mt: 2 }} />
  </Box>
);

const ReviewSection = ({ reviews, currentPage, totalPages, onPageChange }) => {
  const handleChange = (event, value) => {
    onPageChange(value - 1);
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
      <Divider sx={{ my: 3 }} />
      {reviews.length > 0 ? (
        <>
          {reviews.map((review, index) => (
            <Review key={index} review={review} />
          ))}
          <Box display="flex" justifyContent="center" mt={3}>
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
