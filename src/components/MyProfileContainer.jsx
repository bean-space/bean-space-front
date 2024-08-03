import { Avatar, Box, Typography, Button, Container } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import defaultProfile from "../assets/default_profile_image.webp";

const MyProfileContainer = () => {
  const { nickname, email, profileImageUrl } = useAuth();

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
        <Typography variant="body1" color="text.secondary">
          {email === "EMPTY" ? "이메일 주소를 아직 등록하지 않았습니다" : email}
        </Typography>
        <Button
          variant="contained"
          sx={{
            marginTop: 3,
            fontSize: "1rem",
            textShadow: "#000 0.7px 0.5px 2px",
            backgroundColor: "#87CEEB",
            "&:hover": { backgroundColor: "#2AAADE" },
          }}
          onClick={() => alert("수정하기 기능은 아직 제공하지 않습니다")}
        >
          수정하기
        </Button>
      </Box>
    </Container>
  );
};

export default MyProfileContainer;
