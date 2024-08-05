import { Box, Typography, Container, Button } from "@mui/material";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          페이지를 찾을 수 없습니다
        </Typography>
        <Typography variant="body1" paragraph>
          죄송합니다. 요청하신 페이지를 찾을 수 없습니다. URL을 확인해 주세요.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          sx={{
            mt: 2,
            fontSize: "1rem",
            textShadow: "#000 0.7px 0.5px 2px",
            backgroundColor: "#87CEEB",
            "&:hover": { backgroundColor: "#2AAADE" },
          }}
        >
          메인 페이지로 돌아가기
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
