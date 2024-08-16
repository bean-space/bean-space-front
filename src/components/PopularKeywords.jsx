import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  ListItemIcon,
  Box,
  CircularProgress,
} from "@mui/material";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import SearchIcon from "@mui/icons-material/Search";

const PopularKeywords = ({ keywords, isLoading, onSelect }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        position: "absolute",
        width: "100%",
        zIndex: 3,
        maxWidth: 400,
        margin: "0 auto",
        mt: 1,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box sx={{ bgcolor: "#2AAADE", color: "white", p: 2 }}>
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
          <TrendingUpRoundedIcon sx={{ mr: 1 }} />
          실시간 인기 검색어
        </Typography>
      </Box>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <CircularProgress sx={{ color: "#87CEEB" }} />
        </Box>
      ) : (
        <List sx={{ p: 0 }}>
          {keywords.map((term, index) => (
            <ListItem
              key={index}
              onClick={() => onSelect(term)}
              sx={{
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "action.hover",
                },
                transition: "background-color 0.2s",
              }}
            >
              <ListItemIcon>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ width: 24, textAlign: "center" }}
                >
                  {index + 1}
                </Typography>
              </ListItemIcon>
              <ListItemText
                primary={term}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontWeight: 500,
                  },
                }}
              />
              <ListItemIcon sx={{ minWidth: "auto" }}>
                <SearchIcon />
              </ListItemIcon>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default PopularKeywords;
