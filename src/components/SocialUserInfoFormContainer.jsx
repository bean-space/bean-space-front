import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CssBaseline,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import RingVolumeTwoToneIcon from "@mui/icons-material/RingVolumeTwoTone";
import { useNavigate } from "react-router-dom";
import { updateSocialUserInfo } from "../api/auth";
import { useAuth } from "../hooks/useAuth";

const SocialUserInfoFormContainer = () => {
  const navigate = useNavigate();
  const { updateSocialInfo, isLoggedIn, isPhoneNumberEmpty } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!isLoggedIn || !isPhoneNumberEmpty) {
      navigate("/");
    }
  }, [isLoggedIn, isPhoneNumberEmpty, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber || !email) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    if (!/^010\d{8}$/.test(phoneNumber)) {
      alert("휴대폰 번호는 010으로 시작하는 11자리 숫자여야 합니다.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    try {
      const info = {
        phoneNumber,
        email,
      };

      await updateSocialUserInfo(info);
      await updateSocialInfo(email);

      alert("정보가 성공적으로 업데이트되었습니다!");

      navigate(-1);
    } catch (error) {
      if (error.response.data.msg) {
        alert(error.response.data.msg);
      } else {
        alert("정보 업데이트에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handlePhoneNumberChange = (e) => {
    const input = e.target.value;
    const digitsOnly = input.replace(/\D/g, "");
    let formattedPhoneNumber = digitsOnly.slice(0, 11);
    setPhoneNumber(formattedPhoneNumber);
  };

  if (!isLoggedIn || !isPhoneNumberEmpty) return null;

  return (
    <Grid
      container
      component="main"
      sx={{ height: "40vh" }}
      justifyContent="center"
    >
      <CssBaseline />
      <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 5,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#87CEEB" }}>
            <RingVolumeTwoToneIcon />
          </Avatar>
          <Typography component="h1" variant="h5" mt={2}>
            소셜 로그인 유저 정보 추가 입력
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="phoneNumber"
              label="전화번호"
              name="phoneNumber"
              autoComplete="tel"
              autoFocus
              placeholder="010********"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="이메일"
              name="email"
              autoComplete="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                fontSize: "1rem",
                textShadow: "#000 0.7px 0.5px 2px",
                backgroundColor: "#87CEEB",
                "&:hover": { backgroundColor: "#2AAADE" },
              }}
            >
              제출
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SocialUserInfoFormContainer;
