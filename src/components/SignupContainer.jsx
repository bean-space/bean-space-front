import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import AssignmentIndTwoToneIcon from "@mui/icons-material/AssignmentIndTwoTone";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { getPresignedUrl } from "../api/image";
import { signupUser } from "../api/auth";
import KakaoIcon from "../assets/kakao-logo.png";
import LegalModal from "./LegalModal";
import { termsOfService } from "../assets/termsOfService";
import { privacyPolicy } from "../assets/privacyPolicy";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const SignupContainer = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      rejectedFiles.forEach((file) => {
        if (file.file.size > MAX_FILE_SIZE) {
          alert(
            `파일 '${file.file.name}'의 크기가 5MB를 초과합니다. 업로드할 수 없습니다.`
          );
        }
      });
      return;
    }

    const file = acceptedFiles[0];
    setFile(file);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg", ".jfif"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  const uploadImage = async () => {
    if (!file) return;

    try {
      const url = await getPresignedUrl({
        fileName: file.name,
        contentType: file.type,
        imageType: "PROFILE",
      });

      await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      const uploadedUrl = url.split("?")[0];
      return uploadedUrl;
    } catch (error) {
      alert("이미지 업로드에 실패하였습니다");
      throw error;
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!termsAgreed || !privacyAgreed) {
      alert("이용약관과 개인정보 처리방침에 동의해주세요.");
      return;
    }

    if (
      !phoneNumber ||
      !password ||
      !passwordConfirmation ||
      !email ||
      !nickname
    ) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    if (
      nickname.length < 2 ||
      nickname.length > 12 ||
      !/^[가-힣a-zA-Z0-9]+$/.test(nickname)
    ) {
      alert("닉네임은 2~12자의 한글, 영문, 숫자로 설정해주세요.");
      return;
    }

    if (password !== passwordConfirmation) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (
      password.length < 8 ||
      password.length > 20 ||
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/.test(
        password
      )
    ) {
      alert("비밀번호는 8~20자의 영문, 숫자, 특수문자를 포함해야 합니다.");
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
      const uploadedImageUrl = await uploadImage();

      const signupData = {
        phoneNumber,
        password,
        passwordConfirmation,
        email,
        nickname,
        profileImageUrl: uploadedImageUrl,
      };

      await signupUser(signupData);

      alert("회원가입에 성공했습니다!!");
      navigate("/login");
    } catch (error) {
      if (error.response?.data?.msg) {
        alert(error.response.data.msg);
      } else {
        alert("회원가입에 실패하였습니다. 다시 시도해주세요");
      }
      return;
    }
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

  const handleButtonClick = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/login/kakao`;
  };

  return (
    <Grid
      container
      component="main"
      sx={{ height: "92vh", mb: 2 }}
      justifyContent="center"
    >
      <CssBaseline />
      <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
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
            <AssignmentIndTwoToneIcon />
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
              value={passwordConfirmation}
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="nickname"
              label="닉네임"
              type="nickname"
              id="nickname"
              autoComplete="current-nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <Grid container>
              <Grid item xs={12} container justifyContent="center">
                <Box
                  sx={{
                    mt: 1.5,
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    textAlign: "center",
                    "&::before, &::after": {
                      content: '""',
                      position: "absolute",
                      top: "50%",
                      width: "60%",
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
                    프로필 이미지(필수 X)
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                mt: 2,
                mb: 2,
                border: "2px dashed #cccccc",
                borderRadius: 2,
                cursor: "pointer",
                "&:hover": {
                  borderColor: "primary.main",
                },
              }}
            >
              <div {...getRootProps()} style={{ textAlign: "center" }}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <Typography>이미지를 여기에 놓으세요...</Typography>
                ) : (
                  <Typography>
                    이미지를 끌어오거나, 클릭해서 이미지를 업로드하세요
                  </Typography>
                )}
              </div>
            </Paper>

            {previewUrl && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    objectFit: "contain",
                  }}
                />
                <Typography variant="body2" gutterBottom sx={{ mt: 1 }}>
                  선택된 파일: {file.name}
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                mt: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    name="termsAgreed"
                  />
                }
                label={
                  <Typography variant="body2">
                    <span>이용약관 동의</span> {"("}
                    <span
                      onClick={() => setTermsOpen(true)}
                      style={{
                        cursor: "pointer",
                        color: "#4a90e2",
                        textDecoration: "none",
                      }}
                    >
                      보기
                    </span>
                    {")"}
                  </Typography>
                }
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={privacyAgreed}
                    onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    name="privacyAgreed"
                  />
                }
                label={
                  <Typography variant="body2">
                    <span>개인정보 수집 및 이용 동의</span> {"("}
                    <span
                      onClick={() => setPrivacyOpen(true)}
                      style={{
                        cursor: "pointer",
                        color: "#4a90e2",
                        textDecoration: "none",
                      }}
                    >
                      보기
                    </span>
                    {")"}
                  </Typography>
                }
              />
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success"
              sx={{
                mt: 1,
                fontSize: "1rem",
                backgroundColor: "#F17D7B",
                textShadow: "0.5px 0.5px 0.5px #000",
                color: "white",
                "&:hover": { backgroundColor: "#F05552" },
              }}
            >
              회원가입 완료
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
              카카오로 시작하기
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

export default SignupContainer;
