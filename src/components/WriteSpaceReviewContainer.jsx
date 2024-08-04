import {
  Container,
  Typography,
  Box,
  Rating,
  TextField,
  Button,
  Paper,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Divider,
} from "@mui/material";
import ImageUploader from "../components/ImageUploader";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const WriteSpaceReviewContainer = ({
  reservationId,
  reviewContent,
  setReviewContent,
  rating,
  setRating,
  images,
  setImages,
  handleSubmit,
}) => {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const navigate = useNavigate();

  const handleRatingChange = (event, newValue) => {
    setRating(newValue === null || newValue === 0 ? 1 : newValue);
  };

  const handleOpenConfirmDialog = (e) => {
    e.preventDefault();
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleConfirmSubmit = () => {
    handleCloseConfirmDialog();
    handleSubmit();
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          리뷰 작성
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          예약 번호: {reservationId}
        </Typography>
        <form onSubmit={handleOpenConfirmDialog}>
          <Box mb={2}>
            <Typography variant="subtitle1" gutterBottom>
              평점
            </Typography>
            <Rating
              name="rating"
              value={rating}
              onChange={handleRatingChange}
              precision={1}
              icon={<StarIcon fontSize="inherit" />}
              emptyIcon={<StarIcon fontSize="inherit" />}
              max={5}
              min={1}
              sx={{
                "& .MuiRating-iconFilled": {
                  color: "#ffb400",
                },
                "& .MuiRating-iconHover": {
                  color: "#ffa000",
                },
              }}
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="리뷰 내용"
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            margin="normal"
          />
          <Divider flexItem sx={{ my: 2 }} />
          <Typography variant="h5" component="h1" sx={{ mt: 2 }} gutterBottom>
            리뷰 이미지 (필수 X)
          </Typography>
          <Box my={2}>
            <ImageUploader images={images} setImages={setImages} />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{
                fontSize: "1rem",
                border: `1px solid`,
                "&:hover": {
                  backgroundColor: "#f17d7b",
                  border: `1px solid #E25350`,
                  color: "#E25350",
                },
                "&.MuiButton-containedError": {
                  border: `1px solid`,
                },
                color: "#F17D7B",
              }}
            >
              뒤로 가기
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                fontSize: "1rem",
                textShadow: "#000 0.7px 0.5px 2px",
                backgroundColor: "#87CEEB",
                "&:hover": { backgroundColor: "#2AAADE" },
              }}
            >
              리뷰 제출
            </Button>
          </Box>
        </form>
      </Paper>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"리뷰 등록 확인"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            리뷰를 등록하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>취소</Button>
          <Button onClick={handleConfirmSubmit} autoFocus>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WriteSpaceReviewContainer;
