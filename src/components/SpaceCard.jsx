import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function SpaceCard() {
  return (
    <Card sx={{ width: "85%", border: "1px solid #ddd" }}>
      <CardHeader title="전주 한옥 하우스" subheader="깨끗한 집입니다" />
      <CardMedia
        component="img"
        height="250"
        image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF1Q2r0apkXXpI8zULrii3ggiFLg3-v_SLIA&s"
        alt="image"
      />
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
