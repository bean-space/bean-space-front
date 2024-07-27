import { Box, Typography, Divider, Avatar, Rating, Paper } from "@mui/material";
import Carousel from "react-material-ui-carousel";

const Review = ({ review }) => (
  <Box mb={3}>
    <Box display="flex" alignItems="center" mb={1}>
      <Avatar src={review.reviewerProfileUrl} alt={review.reviewerName} />
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

const ReviewSection = ({ reviews }) => {
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
      {reviews.map((review, index) => (
        <Review key={index} review={review} />
      ))}
    </Box>
  );
};

export default ReviewSection;
