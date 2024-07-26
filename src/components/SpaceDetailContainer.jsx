import { Paper } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import defaulImage from "../assets/default_house_pic.jpg";

const SpaceDetailContainer = ({ space }) => {
  return (
    <div>
      <Carousel sx={{ height: "100%" }}>
        {space.space.imageUrlList &&
        space.space.imageUrlList.length > 0 &&
        space.space.imageUrlList[0] != "" ? (
          space.space.imageUrlList.map((imageUrl, index) => (
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
      <p>{space.space.id}</p>
      <p>{space.space.listingName}</p>
      <p>{space.space.price}</p>
      <p>{space.space.sido}</p>
      <p>{space.space.content}</p>
      <p>{space.space.defaultPeople}</p>
      <p>{space.space.maxPeople}</p>
      <p>{space.space.pricePerPerson}</p>
      <p>{space.space.bedRoomCount}</p>
      <p>{space.space.bedCount}</p>
      <p>{space.space.bathRoomCount}</p>
      <p>{space.reservedDateList}</p>
      <p>{space.reviewList}</p>
    </div>
  );
};

export default SpaceDetailContainer;
