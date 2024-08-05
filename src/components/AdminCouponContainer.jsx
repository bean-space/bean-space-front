import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Tabs,
  Tab,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import HourglassBottomTwoToneIcon from "@mui/icons-material/HourglassBottomTwoTone";
import PlayArrowTwoToneIcon from "@mui/icons-material/PlayArrowTwoTone";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import { Link, useNavigate } from "react-router-dom";
import { deleteCoupon } from "../api/admin";

const AdminCouponContainer = ({ coupons, setCoupons }) => {
  const [tabValue, setTabValue] = useState(0);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);

  const filterCoupons = useCallback(() => {
    const now = new Date();
    switch (tabValue) {
      case 0:
        setFilteredCoupons(
          coupons.filter((coupon) => new Date(coupon.issueStartAt) > now)
        );
        break;
      case 1:
        setFilteredCoupons(
          coupons.filter(
            (coupon) =>
              new Date(coupon.issueStartAt) <= now &&
              new Date(coupon.issueEndAt) > now
          )
        );
        break;
      case 2:
        setFilteredCoupons(
          coupons.filter((coupon) => new Date(coupon.issueEndAt) <= now)
        );
        break;
      default:
        setFilteredCoupons([]);
    }
  }, [tabValue, coupons]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEdit = (coupon) => {
    navigate(`/admin/coupon/edit/${coupon.id}`, { state: { coupon } });
  };

  const handleDeleteClick = (coupon) => {
    setCouponToDelete(coupon);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (couponToDelete) {
      try {
        await deleteCoupon(couponToDelete.id);
        alert("쿠폰이 삭제되었습니다");

        const updatedCoupons = coupons.filter(
          (coupon) => coupon.id !== couponToDelete.id
        );

        setCoupons(updatedCoupons);
        setFilteredCoupons((prev) =>
          prev.filter((coupon) => coupon.id !== couponToDelete.id)
        );
      } catch (error) {
        if (error.response.data.msg) {
          alert(error.response.data.msg);
        } else {
          alert("삭제에 실패했습니다");
        }
      }
    }
    setOpenDeleteDialog(false);
    setCouponToDelete(null);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setCouponToDelete(null);
  };

  useEffect(() => {
    filterCoupons();
  }, [filterCoupons]);

  return (
    <Container maxWidth="xl">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            "& .Mui-selected": {
              color: "#2AAADE",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#2AAADE",
            },
          }}
        >
          <Tab label="발행 대기 중" icon={<HourglassBottomTwoToneIcon />} />
          <Tab label="발행 중" icon={<PlayArrowTwoToneIcon />} />
          <Tab label="발행 완료" icon={<CheckCircleTwoToneIcon />} />
        </Tabs>
        <Button
          variant="contained"
          component={Link}
          startIcon={<AddIcon />}
          to="/admin/coupon/create"
          sx={{
            fontSize: "1rem",
            textShadow: "#000 0.7px 0.5px 2px",
            backgroundColor: "#87CEEB",
            "&:hover": { backgroundColor: "#2AAADE" },
            ml: 2,
            mr: 5,
          }}
        >
          쿠폰 생성하기
        </Button>
      </Box>
      <Box mt={3}>
        {filteredCoupons.length > 0 ? (
          <Grid container spacing={2}>
            {filteredCoupons.map((coupon) => (
              <Grid item xs={12} sm={6} md={3} key={coupon.id}>
                <Card sx={{ padding: 0.5 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ ml: 0.5 }} gutterBottom>
                      {coupon.name}
                    </Typography>
                    <Grid container spacing={0.5}>
                      <Grid item xs={5}>
                        <Typography variant="body2">
                          할인율(%): {coupon.discountRate}%
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography variant="body2">
                          최대 할인 금액: {coupon.maxDiscount}원
                        </Typography>
                      </Grid>
                      <Grid item xs={5}>
                        <Typography variant="body2">
                          총 수량: {coupon.totalQuantity}
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography variant="body2">
                          남은 수량: {coupon.stock}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Box mt={2}>
                      <Typography variant="body2">
                        발행 시작 시간: {formatDateTime(coupon.issueStartAt)}
                      </Typography>
                      <Typography variant="body2">
                        발행 종료 시간: {formatDateTime(coupon.issueEndAt)}
                      </Typography>
                      <Typography variant="body2">
                        쿠폰 만료 시간: {formatDateTime(coupon.expirationAt)}
                      </Typography>
                    </Box>
                    {tabValue === 0 && (
                      <Box mt={3} display="flex" justifyContent="flex-end">
                        <Button
                          sx={{
                            color: "#2AAADE",
                            border: `1px solid`,
                            "&.MuiButton-containedError": {
                              border: `1px solid`,
                            },
                            mr: 1,
                          }}
                          size="small"
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={() => handleEdit(coupon)}
                        >
                          수정
                        </Button>
                        <Button
                          variant="outlined"
                          sx={{
                            mr: 1,
                            border: `1px solid`,
                            "&.MuiButton-containedError": {
                              border: `1px solid`,
                            },
                            color: "#F17D7B",
                          }}
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteClick(coupon)}
                          color="error"
                        >
                          삭제
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography
            variant="h6"
            align="center"
            color="textSecondary"
            sx={{ mt: 8 }}
          >
            표시할 쿠폰이 없습니다.
          </Typography>
        )}
      </Box>
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"쿠폰 삭제 확인"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            정말로 이 쿠폰을 삭제하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} sx={{ color: "#87CEEB" }}>
            취소
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            sx={{ color: "#E25350" }}
            autoFocus
          >
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminCouponContainer;
