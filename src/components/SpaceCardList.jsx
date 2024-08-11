import Carousel from "react-material-ui-carousel";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
  Paper,
} from "@mui/material";
import defaultImage from "../assets/default_house_pic.jpg";
import { Link, useLocation } from "react-router-dom";

const SpaceCardList = ({ spaces }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const checkIn = queryParams.get("checkIn");
  const checkOut = queryParams.get("checkOut");
  const headCount = queryParams.get("headCount");

  const newQueryString = new URLSearchParams({
    checkIn: checkIn || "",
    checkOut: checkOut || "",
    headCount: headCount || "",
  }).toString();

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom sx={{ ml: 3 }}>
        검색 결과
      </Typography>
      {spaces.length === 0 ? (
        <Typography variant="h5" align="center" sx={{ mt: 4, mb: 5 }}>
          검색 결과가 없습니다.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {spaces.map((space) => (
            <Grid item key={space.id} xs={12} sm={6} md={3}>
              <Card>
                <Box sx={{ height: "25vh", overflow: "hidden" }}>
                  <Carousel sx={{ height: "100%" }} autoPlay={false}>
                    {space.imageUrlList &&
                    space.imageUrlList.length > 0 &&
                    space.imageUrlList[0] != "" ? (
                      space.imageUrlList.map((imageUrl, index) => (
                        <Paper
                          className="mainImg"
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
                            alt="Default Image"
                          />
                        </Paper>
                      ))
                    ) : (
                      <Paper
                        className="defaultImg"
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
                          alt="Default Image"
                        />
                      </Paper>
                    )}
                  </Carousel>
                </Box>
                <CardContent>
                  <Link
                    to={`/space/${space.id}?${newQueryString}`}
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
                        height: "1.6em",
                        color: "black",
                      }}
                    >
                      {space.listingName}
                    </Typography>
                  </Link>
                  <Typography variant="body1" color="black" fontWeight="bold">
                    {space.price.toLocaleString()} 원/ 1박
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    기준 인원: {space.defaultPeople} 명
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign={"right"}
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

export default SpaceCardList;
