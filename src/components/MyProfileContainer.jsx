import { Avatar, Box, Typography, Button, Container } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import defaultProfile from "../assets/default_profile_image.webp";
import { useNavigate } from "react-router-dom";

const MyProfileContainer = () => {
  const { nickname, email, profileImageUrl, isPhoneNumberEmpty } = useAuth();
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "98vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar
          alt="프로필 이미지"
          src={profileImageUrl || defaultProfile}
          sx={{
            width: 100,
            height: 100,
            marginBottom: 2,
            border: "2px solid #00000019",
            boxShadow: "0 0 10px #00000019",
          }}
        />
        <Typography component="h1" variant="h5" mb={1}>
          {nickname}
        </Typography>
        <Typography variant="body1" color="text.secondary" my={1}>
          {email === "EMPTY" ? "이메일 주소를 아직 등록하지 않았습니다" : email}
        </Typography>
        <Typography variant="body1" color="text.secondary" my={1}>
          {isPhoneNumberEmpty === true
            ? "전화번호를 아직 등록하지 않았습니다"
            : null}
        </Typography>
        {isPhoneNumberEmpty === false ? (
          <Button
            variant="contained"
            sx={{
              marginTop: 2,
              fontSize: "1rem",
              textShadow: "#000 0.7px 0.5px 2px",
              backgroundColor: "#87CEEB",
              "&:hover": { backgroundColor: "#2AAADE" },
            }}
            onClick={() => navigate("/my-profile/edit")}
          >
            프로필 수정하기
          </Button>
        ) : null}
        {isPhoneNumberEmpty === true ? (
          <Button
            variant="contained"
            sx={{
              mt: 2,
              fontSize: "1rem",
              backgroundColor: "#F17D7B",
              textShadow: "0.5px 0.5px 0.5px #000",
              color: "white",
              "&:hover": { backgroundColor: "#F05552" },
            }}
            onClick={() => navigate("/social-user-info-update")}
          >
            소셜 로그인 유저 추가 정보 입력하기
          </Button>
        ) : null}
      </Box>
    </Container>
  );
};

export default MyProfileContainer;
