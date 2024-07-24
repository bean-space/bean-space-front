import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  createTheme,
  CssBaseline,
  Grid,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import LockOpenTwoToneIcon from "@mui/icons-material/LockOpenTwoTone";
import KakaoIcon from "../assets/kakao-logo.png";

const LoginContainer = () => {
  const defaultTheme = createTheme();
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber || !password) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const success = await login({ phoneNumber, password });
    if (success) {
      navigate("/");
    }
  };

  const handleSignupClick = () => {
    navigate("/signup");
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid
        container
        component="main"
        sx={{ height: "60vh" }}
        justifyContent="center"
      >
        <CssBaseline />
        <Grid
          item
          xs={12}
          sm={8}
          md={3.5}
          component={Paper}
          elevation={6}
          square
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
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
                sx={{ mt: 3, fontSize: "1rem" }}
              >
                로그인
              </Button>
              <Button
                onClick={handleButtonClick}
                type="submit"
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
                sx={{ mt: 2, fontSize: "1rem" }}
                onClick={handleSignupClick}
              >
                회원가입
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};
export default LoginContainer;
