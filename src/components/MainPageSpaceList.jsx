import Carousel from "react-material-ui-carousel";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
  Paper,
  CircularProgress,
} from "@mui/material";
import defaultImage from "../assets/default_house_pic.jpg";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPopularSpaces } from "../api/space";

const MainPageSpaceList = () => {
  const [popularSpaces, setPopularSpaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPopularSpaces = async () => {
      try {
        const data = await getPopularSpaces();
        setPopularSpaces(data);
      } catch (error) {
        if (error.response.data.msg) {
          alert(error.response.data.msg);
        } else {
          alert("인기 숙소를 불러올 수 없습니다!");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularSpaces();
  }, []);

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box
          my={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress sx={{ color: "#87CEEB" }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 8, mb: 5 }}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ mb: 4, fontWeight: "bold" }}
      >
        최근 일주일 간 가장 인기가 많은 공간
      </Typography>
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="200px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {popularSpaces.map((space) => (
            <Grid item key={space.spaceId} xs={12} sm={6} md={3}>
              <Card>
                <Box sx={{ height: "25vh", overflow: "hidden" }}>
                  <Carousel sx={{ height: "100%" }} autoPlay={false}>
                    {space.imageUrlList &&
                    space.imageUrlList.length > 0 &&
                    space.imageUrlList[0] !== "" ? (
                      space.imageUrlList.map((imageUrl, index) => (
                        <Paper
                          key={index}
                          sx={{
                            height: "25vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              backgroundImage: `url(${imageUrl})`,
                              backgroundPosition: "center",
                              backgroundSize: "cover",
                            }}
                          />
                        </Paper>
                      ))
                    ) : (
                      <Paper
                        sx={{
                          height: "25vh",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundImage: `url(${defaultImage})`,
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                          }}
                        />
                      </Paper>
                    )}
                  </Carousel>
                </Box>
                <CardContent>
                  <Link
                    to={`/space/${space.spaceId}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        lineHeight: "1.2em",
                        height: "2.4em",
                        color: "black",
                      }}
                    >
                      {space.listingName}
                    </Typography>
                  </Link>
                  <Typography variant="body1" color="black" fontWeight="bold">
                    {space.price.toLocaleString()} 원 / 1박
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    기준 인원: {space.defaultPeople} 명
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="right"
                  >
                    {space.sidoAndSigungu}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MainPageSpaceList;
