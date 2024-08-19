import Carousel from "react-material-ui-carousel";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
  Paper,
  Tabs,
  Tab,
  Rating,
} from "@mui/material";
import defaultImage from "../assets/default_house_pic.jpg";
import { Link, useLocation } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";

const SpaceCardList = ({ spaces, onSortChange, currentSortOption }) => {
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

  const handleSortChange = (event, newValue) => {
    onSortChange(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ ml: 3, fontWeight: 600 }}>
          검색 결과
        </Typography>
        <Tabs
          value={currentSortOption}
          onChange={handleSortChange}
          aria-label="sorting options"
          sx={{
            color: "#2AAADE",
            "& .Mui-selected": {
              color: "#2AAADE",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#2AAADE",
            },
          }}
        >
          <Tab label="별점 높은 순" />
          <Tab label="새로 등록된 순" />
          <Tab label="가격 낮은 순" />
          <Tab label="가격 높은 순" />
          <Tab label="최근 예약 많은 순" />
        </Tabs>
      </Box>
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
                  <Carousel
                    sx={{ height: "100%" }}
                    autoPlay={false}
                    animation="slide"
                    indicators={true}
                    indicatorContainerProps={{
                      style: {
                        position: "absolute",
                        bottom: "20px",
                        zIndex: 1,
                        marginTop: 0,
                      },
                    }}
                  >
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
                <Link
                  to={`/space/${space.id}?${newQueryString}`}
                  style={{ textDecoration: "none" }}
                >
                  <CardContent>
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

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      {space.averageRating > 0 ? (
                        <>
                          <Rating
                            name="read-only"
                            value={space.averageRating}
                            readOnly
                            precision={0.1}
                            size="small"
                            emptyIcon={
                              <StarIcon
                                style={{ opacity: 0.55 }}
                                fontSize="inherit"
                              />
                            }
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ ml: 1 }}
                          >
                            ({space.averageRating.toFixed(1)})
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          아직 리뷰가 없습니다
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="body1" color="black" fontWeight="bold">
                      {space.price.toLocaleString()} 원/ 1박
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      최대 인원: {space.maxPeople} 명
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign={"right"}
                    >
                      {space.sidoAndSigungu}
                    </Typography>
                  </CardContent>
                </Link>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default SpaceCardList;
