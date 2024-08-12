import { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  ListItemIcon,
  Box,
} from "@mui/material";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import SearchIcon from "@mui/icons-material/Search";
import { getPopularKeywords } from "../api/space";

const PopularKeywords = ({ onSelect }) => {
  const [popularKeywords, setPopularKeywords] = useState([]);

  useEffect(() => {
    const fetchPopularKeywords = async () => {
      try {
        const data = await getPopularKeywords();
        setPopularKeywords(data.popularKeywordList);
      } catch (error) {
        if (error.response.data.msg) {
          alert(error.response.data.msg);
        } else {
          alert("인기 검색어를 불러올 수 없습니다!");
        }
      }
    };

    fetchPopularKeywords();
  }, []);

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
          <TrendingUpRoundedIcon sx={{ mr: 1 }} />한 주간 인기 검색어
        </Typography>
      </Box>
      <List sx={{ p: 0 }}>
        {popularKeywords.map((term, index) => (
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
    </Paper>
  );
};

export default PopularKeywords;
