import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import SpaceCard from "./SpaceCard";

export default function MainCard() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} minHeight={160}>
        <Grid xs display="flex" justifyContent="center" alignItems="center">
          <SpaceCard />
        </Grid>
        <Grid xs display="flex" justifyContent="center" alignItems="center">
          <SpaceCard />
        </Grid>
        <Grid xs display="flex" justifyContent="center" alignItems="center">
          <SpaceCard />
        </Grid>
        <Grid xs display="flex" justifyContent="center" alignItems="center">
          <SpaceCard />
        </Grid>
      </Grid>
    </Box>
  );
}
