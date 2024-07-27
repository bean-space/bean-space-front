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
import defaulImage from "../assets/default_house_pic.jpg";
import { Link, useLocation } from "react-router-dom";

const sidoOptions = [
  { display: "전체", value: "전체" },
  { display: "서울", value: "서울특별시" },
  { display: "제주", value: "제주특별자치도" },
  { display: "부산", value: "부산광역시" },
  { display: "인천", value: "인천광역시" },
  { display: "대구", value: "대구광역시" },
  { display: "대전", value: "대전광역시" },
  { display: "광주", value: "광주광역시" },
  { display: "울산", value: "울산광역시" },
  { display: "세종", value: "세종특별자치시" },
  { display: "경기", value: "경기도" },
  { display: "충북", value: "충청북도" },
  { display: "충남", value: "충청남도" },
  { display: "전북", value: "전북특별자치도" },
  { display: "전남", value: "전라남도" },
  { display: "경북", value: "경상북도" },
  { display: "경남", value: "경상남도" },
  { display: "강원", value: "강원특별자치도" },
];

const modifySido = (sido) => {
  const match = sidoOptions.find((item) => item.value === sido);
  return match ? match.display : null;
};

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
    <Container maxWidth="xl" sx={{ marginTop: "1%" }}>
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
                          backgroundImage: `url(${defaulImage})`,
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
                      height: "2.4em",
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
                  {modifySido(space.sido)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SpaceCardList;
