import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
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
import LockOpenTwoToneIcon from "@mui/icons-material/LockOpenTwoTone";
import KakaoIcon from "../assets/kakao-logo.png";
import LegalModal from "./LegalModal";
import { termsOfService } from "../assets/termsOfService";
import { privacyPolicy } from "../assets/privacyPolicy";

const LoginContainer = () => {
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const handleButtonClick = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/login/kakao`;
  };

  const handleChange = (e) => {
    const input = e.target.value;

    const digitsOnly = input.replace(/\D/g, "");

    let formattedPhoneNumber = digitsOnly;

    if (formattedPhoneNumber.length > 11) {
      formattedPhoneNumber = formattedPhoneNumber.slice(0, 11);
    }

    setPhoneNumber(formattedPhoneNumber);
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      const previousUrl = localStorage.getItem("previousUrl");
      if (previousUrl) {
        localStorage.removeItem("previousUrl");
        navigate(previousUrl);
      } else {
        navigate("/");
      }
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber || !password) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const success = await login({ phoneNumber, password });
    if (success) {
      const previousUrl = localStorage.getItem("previousUrl");
      alert("로그인에 성공하였습니다!");
      if (previousUrl) {
        localStorage.removeItem("previousUrl");
        navigate(previousUrl);
      } else {
        navigate("/");
      }
    }
  };

  const handleSignupClick = () => {
    navigate("/signup");
  };

  return (
    <Grid
      container
      component="main"
      sx={{ height: "60vh" }}
      justifyContent="center"
    >
      <CssBaseline />
      <Grid item xs={12} sm={8} md={3.5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 4,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#87CEEB" }}>
            <LockOpenTwoToneIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            로그인
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
              autoComplete="phoneNumber"
              autoFocus
              placeholder="010********"
              value={phoneNumber}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success"
              sx={{
                mt: 3,
                fontSize: "1rem",
                textShadow: "#000 0.7px 0.5px 2px",
                backgroundColor: "#87CEEB",
                "&:hover": { backgroundColor: "#2AAADE" },
              }}
            >
              로그인
            </Button>
            <Button
              onClick={handleButtonClick}
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                fontSize: "1rem",
                backgroundColor: "#eeeeee",
                color: "#000000",
                "&:hover": { backgroundColor: "gold" },
              }}
              startIcon={
                <img
                  src={KakaoIcon}
                  alt="Kakao"
                  style={{ width: "20px", height: "20px" }}
                />
              }
            >
              카카오 로그인
            </Button>
            <Typography
              variant="caption"
              display="block"
              sx={{
                textAlign: "center",
                mt: 1,
                color: "text.secondary",
              }}
            >
              소셜 로그인 이용시{" "}
              <span
                onClick={() => setTermsOpen(true)}
                style={{
                  cursor: "pointer",
                  color: "#4a90e2",
                }}
              >
                서비스 이용약관
              </span>{" "}
              및{" "}
              <span
                onClick={() => setPrivacyOpen(true)}
                style={{
                  cursor: "pointer",
                  color: "#4a90e2",
                }}
              >
                개인정보 처리방침
              </span>
              에 동의하게 됩니다
            </Typography>
            <Grid container>
              <Grid item xs={12} container justifyContent="center">
                <Box
                  sx={{
                    mt: 2.5,
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    textAlign: "center",
                    "&::before, &::after": {
                      content: '""',
                      position: "absolute",
                      top: "50%",
                      width: "50%",
                      borderTop: "1px solid rgba(0, 0, 0, 0.7)",
                    },
                    "&::before": {
                      right: "100%",
                      marginRight: "8px",
                    },
                    "&::after": {
                      left: "100%",
                      marginLeft: "8px",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      color: "rgba(0, 0, 0, 0.7)",
                      margin: 0,
                    }}
                  >
                    아직 회원이 아니라면
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                fontSize: "1rem",
                textShadow: "0.5px 0.5px 0.5px #000",
              }}
              onClick={handleSignupClick}
            >
              회원가입
            </Button>
            <Box
              sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 3 }}
            >
              <Button
                onClick={() => setTermsOpen(true)}
                sx={{
                  fontSize: "0.8rem",
                  color: "#4a90e2",
                  textDecoration: "none",
                  "&:hover": {
                    backgroundColor: "transparent",
                    textDecoration: "none",
                  },
                }}
              >
                서비스 이용약관
              </Button>
              <Button
                onClick={() => setPrivacyOpen(true)}
                sx={{
                  fontSize: "0.8rem",
                  color: "#4a90e2",
                  textDecoration: "none",
                  "&:hover": {
                    backgroundColor: "transparent",
                    textDecoration: "none",
                  },
                }}
              >
                개인정보 처리방침
              </Button>
            </Box>
          </Box>
        </Box>
      </Grid>
      <LegalModal
        open={termsOpen}
        handleClose={() => setTermsOpen(false)}
        title="서비스 이용약관"
        content={termsOfService}
      />
      <LegalModal
        open={privacyOpen}
        handleClose={() => setPrivacyOpen(false)}
        title="개인정보 처리방침"
        content={privacyPolicy}
      />
    </Grid>
  );
};
export default LoginContainer;
