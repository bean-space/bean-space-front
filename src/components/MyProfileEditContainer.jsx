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
import AssignmentIndTwoToneIcon from "@mui/icons-material/AssignmentIndTwoTone";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { getPresignedUrl } from "../api/image";
import { updateUserProfile } from "../api/auth";

const MyProfileEditContainer = () => {
  const {
    updateProfileInfo,
    isLoggedIn,
    isPhoneNumberEmpty,
    nickname: authNickname,
    email: authEmail,
    profileImageUrl: authProfileImageUrl,
  } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    if (isLoggedIn && !isPhoneNumberEmpty) {
      setEmail(authEmail || "");
      setNickname(authNickname || "");
      setPreviewUrl(authProfileImageUrl || null);
    } else {
      navigate("/");
    }
  }, [
    isLoggedIn,
    isPhoneNumberEmpty,
    authEmail,
    authNickname,
    authProfileImageUrl,
    navigate,
  ]);

  const onDrop = useCallback((acceptedFiles) => {
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
  });

  const uploadImage = async () => {
    if (!file) return null;

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

  const handleRemoveImage = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nickname) {
      alert("닉네임을 입력해주세요.");
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

    if (!validateEmail(email)) {
      setEmailError(true);
      return;
    }

    try {
      let uploadedImageUrl = previewUrl;

      if (file) {
        uploadedImageUrl = await uploadImage();
      }

      const updatedProfileData = {
        email,
        nickname,
        profileImageUrl: uploadedImageUrl,
      };

      await updateUserProfile(updatedProfileData);

      updateProfileInfo(updatedProfileData);

      alert("프로필이 성공적으로 업데이트되었습니다!");

      navigate("/my-profile");
    } catch (error) {
      if (error.response.data.msg) {
        alert(error.response.data.msg);
      } else {
        alert("프로필 업데이트에 실패하였습니다. 다시 시도해주세요");
      }
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError(!validateEmail(newEmail));
  };

  return (
    <Grid
      container
      component="main"
      sx={{ height: "55vh" }}
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
            <AssignmentIndTwoToneIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            프로필 수정
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              fullWidth
              required
              name="email"
              label="이메일"
              type="email"
              id="email"
              autoComplete="email"
              value={email}
              onChange={handleEmailChange}
              error={emailError}
              helperText={
                emailError ? "올바른 이메일 형식으로 입력해주세요" : ""
              }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="nickname"
              label="닉네임"
              type="text"
              id="nickname"
              autoComplete="nickname"
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
                    프로필 이미지
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            {previewUrl ? (
              <Box
                sx={{
                  mt: 2,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "150px",
                    objectFit: "contain",
                    marginBottom: "5px",
                  }}
                />
                <Button
                  onClick={handleRemoveImage}
                  variant="contained"
                  sx={{
                    fontSize: "0.9rem",
                    backgroundColor: "#F17D7B",
                    textShadow: "0.5px 0.5px 0.5px #000",
                    color: "white",
                    "&:hover": { backgroundColor: "#F05552" },
                  }}
                >
                  이미지 삭제
                </Button>
              </Box>
            ) : (
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
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                marginTop: 2,
                fontSize: "1rem",
                textShadow: "#000 0.7px 0.5px 2px",
                backgroundColor: "#87CEEB",
                "&:hover": { backgroundColor: "#2AAADE" },
              }}
            >
              프로필 수정 하기
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default MyProfileEditContainer;
