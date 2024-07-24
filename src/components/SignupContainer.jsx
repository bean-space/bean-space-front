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
import KakaoLogo from "../assets/kakao_login_large_wide.png";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const SignupContainer = () => {
  const defaultTheme = createTheme();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    navigate("/");
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

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid
        container
        component="main"
        sx={{ height: "65vh" }}
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
              회원가입
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
              <TextField
                margin="normal"
                required
                fullWidth
                name="PasswordConfirmation"
                label="비밀번호 확인"
                type="password"
                id="PasswordConfirmation"
                autoComplete="current-password"
                value={PasswordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="email"
                label="이메일"
                type="email"
                id="email"
                autoComplete="current-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="success"
                sx={{ mt: 3, fontSize: "1rem" }}
              >
                회원가입 완료
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{
                  mt: 3,
                  mb: 3,
                  backgroundImage: `url(${KakaoLogo})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",

                  minWidth: "40px",
                  minHeight: "40px",
                  "&:hover": {
                    backgroundImage: `url(${KakaoLogo})`,
                  },
                }}
              ></Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default SignupContainer;
