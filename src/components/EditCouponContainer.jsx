import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateCoupon } from "../api/admin";
import dayjs from "dayjs";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";

const EditCouponContainer = ({ coupon, setCoupon }) => {
  const navigate = useNavigate();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const formattedCoupon = useMemo(() => {
    if (!coupon) return null;
    return {
      ...coupon,
      issueStartAt: coupon.issueStartAt ? dayjs(coupon.issueStartAt) : null,
      issueEndAt: coupon.issueEndAt ? dayjs(coupon.issueEndAt) : null,
      expirationAt: coupon.expirationAt ? dayjs(coupon.expirationAt) : null,
      maxDiscount: coupon.maxDiscount.toLocaleString(),
    };
  }, [coupon]);

  useEffect(() => {
    if (formattedCoupon) {
      setCoupon(formattedCoupon);
    }
  }, [formattedCoupon, setCoupon]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    let newValue = value;

    switch (name) {
      case "discountRate":
        newValue = Math.max(0, Math.min(100, parseInt(value) || 0));
        break;
      case "totalQuantity":
        newValue = Math.max(0, parseInt(value) || 0);
        break;
      case "maxDiscount":
        newValue = value.replace(/[^\d]/g, "");
        newValue = newValue ? Number(newValue).toLocaleString() : "";
        break;
      default:
        break;
    }

    setCoupon((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleDateTimeChange = (name) => (newValue) => {
    setCoupon((prev) => ({ ...prev, [name]: newValue }));
  };

  const validateDates = () => {
    const now = dayjs();

    if (coupon.issueStartAt && coupon.issueStartAt.isBefore(now)) {
      return "발행 시작 시간은 현재 시간 이후여야 합니다";
    }
    if (coupon.issueEndAt && coupon.issueEndAt.isBefore(coupon.issueStartAt)) {
      return "발행 종료 시간은 발행 시작 시간 이후여야 합니다";
    }
    if (
      coupon.expirationAt &&
      coupon.expirationAt.isBefore(coupon.issueEndAt)
    ) {
      return "쿠폰 만료 시간은 발행 종료 시간 이후여야 합니다";
    }
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    for (const key in coupon) {
      if (coupon[key] === null || coupon[key] === "") {
        alert("모든 필드를 채워주세요.");
        return null;
      }
    }

    if (parseInt(coupon.discountRate) === 0) {
      alert("할인율은 0보다 커야 합니다");
      return null;
    }
    if (parseInt(coupon.totalQuantity) === 0) {
      alert("쿠폰 수량은 0보다 커야 합니다.");
      return null;
    }

    const validationError = validateDates();

    if (validationError) {
      alert(validationError);
    } else {
      setOpenConfirmDialog(true);
    }
  };

  const handleConfirmCancel = () => {
    setOpenConfirmDialog(false);
  };

  const handleConfirmSubmit = async () => {
    setOpenConfirmDialog(false);
    const couponData = {
      ...coupon,
      discountRate: parseInt(coupon.discountRate),
      maxDiscount: parseInt(coupon.maxDiscount.replace(/,/g, "")),
      issueStartAt: dayjs(coupon.issueStartAt).format("YYYY-MM-DDTHH:mm:ss"),
      issueEndAt: dayjs(coupon.issueEndAt).format("YYYY-MM-DDTHH:mm:ss"),
      expirationAt: dayjs(coupon.expirationAt).format("YYYY-MM-DDTHH:mm:ss"),
    };
    try {
      await updateCoupon({ coupon: couponData, id: couponData.id });
      alert("쿠폰이 성공적으로 수정되었습니다");
      navigate(-1);
    } catch (error) {
      if (error.response.data.msg) {
        alert(error.response.data.msg);
      } else {
        alert("쿠폰 수정에 실패하였습니다");
      }
    }
  };

  if (!formattedCoupon) {
    return <div>로딩 중...</div>;
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ margin: "auto", mt: 1 }}
        >
          <Typography variant="h4" gutterBottom>
            쿠폰 수정하기
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                name="name"
                label="쿠폰 이름"
                value={coupon.name}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                margin="normal"
                name="discountRate"
                label="할인율 (%)"
                value={coupon.discountRate}
                onChange={handleChange}
                InputProps={{
                  inputProps: { min: 1, max: 100 },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                margin="normal"
                name="maxDiscount"
                label="최대 할인 금액"
                value={coupon.maxDiscount}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">원</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                margin="normal"
                name="totalQuantity"
                label="쿠폰 수량"
                value={coupon.totalQuantity}
                onChange={handleChange}
                InputProps={{
                  inputProps: { min: 0 },
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle1" gutterBottom>
                발행 시작 시간
              </Typography>
              <DateTimePicker
                value={formattedCoupon.issueStartAt}
                onChange={handleDateTimeChange("issueStartAt")}
                views={["year", "month", "day", "hours"]}
                format="YYYY년 MM월 DD일 HH시"
                ampm={false}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle1" gutterBottom>
                발행 종료 시간
              </Typography>
              <DateTimePicker
                value={formattedCoupon.issueEndAt}
                onChange={handleDateTimeChange("issueEndAt")}
                views={["year", "month", "day", "hours"]}
                format="YYYY년 MM월 DD일 HH시"
                ampm={false}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle1" gutterBottom>
                만료 시간
              </Typography>
              <DateTimePicker
                value={formattedCoupon.expirationAt}
                onChange={handleDateTimeChange("expirationAt")}
                views={["year", "month", "day", "hours"]}
                format="YYYY년 MM월 DD일 HH시"
                ampm={false}
                sx={{ width: "100%" }}
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 3,
              mr: 1,
            }}
          >
            <Button
              variant="outlined"
              sx={{
                mr: 1,
                mb: 1,
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
              onClick={() => navigate(-1)}
            >
              이전 페이지로
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                mb: 1,
                fontSize: "1rem",
                textShadow: "#000 0.7px 0.5px 2px",
                backgroundColor: "#87CEEB",
                "&:hover": { backgroundColor: "#2AAADE" },
              }}
            >
              쿠폰 수정
            </Button>
          </Box>
        </Box>
      </Paper>
      <Dialog
        open={openConfirmDialog}
        onClose={handleConfirmCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"쿠폰 수정 확인"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            정말로 쿠폰을 수정하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmCancel}>취소</Button>
          <Button onClick={handleConfirmSubmit} autoFocus>
            수정
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EditCouponContainer;
