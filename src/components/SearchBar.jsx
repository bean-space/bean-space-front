import { useState, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  Paper,
  Tooltip,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  ClickAwayListener,
  Typography,
  Divider,
  Checkbox,
  Slider,
  FormControlLabel,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltTwoToneIcon from "@mui/icons-material/FilterAltTwoTone";
import FilterAltOffTwoToneIcon from "@mui/icons-material/FilterAltOffTwoTone";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";
import DateRangePicker from "./DateRangePicker";
import PopularKeywords from "../components/PopularKeywords";
import { useOffer } from "../hooks/useOffer";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { addDays } from "date-fns";

const SearchBar = () => {
  const { searchState, setSearchState } = useSearch();
  const {
    searchKeyword,
    dateRange,
    peopleCount,
    minPrice,
    maxPrice,
    offers,
    bedrooms,
    beds,
    bathrooms,
  } = searchState;
  const navigate = useNavigate();
  const { offerList } = useOffer();

  const [isExpanded, setIsExpanded] = useState(false);
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice || 500000]);
  const [showPopularSearches, setShowPopularSearches] = useState(false);
  const searchInputRef = useRef(null);
  const popularKeywordsRef = useRef(null);

  useEffect(() => {
    setPriceRange([minPrice, maxPrice || 500000]);
  }, [minPrice, maxPrice]);

  const handleDateRangeChange = (newDateRange) => {
    setSearchState((prev) => ({ ...prev, dateRange: newDateRange }));
  };

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleOfferChange = (offer) => {
    setSearchState((prev) => ({
      ...prev,
      offers: prev.offers.includes(offer)
        ? prev.offers.filter((o) => o !== offer)
        : [...prev.offers, offer],
    }));
  };

  const handlePriceRangeChange = (_, newValue) => {
    setPriceRange(newValue);
    setSearchState((prev) => ({
      ...prev,
      minPrice: newValue[0],
      maxPrice: newValue[1] >= 500000 ? null : newValue[1],
    }));
  };

  const formatPrice = (value) => {
    if (value >= 500000) {
      return "500,000원+";
    }
    return `${value.toLocaleString()}원`;
  };

  const formatPersonCount = (value, max) => {
    return value >= max ? `${max}명+` : `${value}명`;
  };

  const formatRoomCount = (value) => {
    return value === 0 ? `0개 이상` : `${value}개 이상`;
  };

  const renderPersonMenuItems = (max) => {
    const items = [];
    for (let i = 1; i <= max; i++) {
      items.push(
        <MenuItem key={i} value={i}>
          {formatPersonCount(i, max)}
        </MenuItem>
      );
    }
    return items;
  };

  const renderRoomMenuItems = (max) => {
    const items = [];
    for (let i = 0; i <= max; i++) {
      items.push(
        <MenuItem key={i} value={i}>
          {formatRoomCount(i)}
        </MenuItem>
      );
    }
    return items;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    const queryParams = new URLSearchParams();

    if (searchKeyword.trim() !== "") {
      queryParams.append("keyword", searchKeyword.trim());
    }

    queryParams.append("checkIn", formatDate(dateRange.startDate));
    queryParams.append("checkOut", formatDate(dateRange.endDate));
    queryParams.append("headCount", peopleCount);

    if (priceRange[0] > 0) {
      queryParams.append("priceMin", priceRange[0]);
    }

    if (priceRange[1] < 500000) {
      queryParams.append("priceMax", priceRange[1]);
    }

    if (bedrooms > 0) {
      queryParams.append("bedRoomCount", bedrooms);
    }

    if (beds > 0) {
      queryParams.append("bedCount", beds);
    }

    if (bathrooms > 0) {
      queryParams.append("bathRoomCount", bathrooms);
    }

    offers.forEach((offer) => {
      queryParams.append("offer", offer);
    });

    queryParams.append("sort", "rating");

    setSearchState((prev) => ({
      ...prev,
      sortOption: 0,
    }));

    navigate(`/space/search?${queryParams.toString()}`);
  };

  const handleSearchFocus = () => {
    setShowPopularSearches(true);
  };

  const handleSearchBlur = () => {
    if (!popularKeywordsRef.current?.contains(document.activeElement)) {
      setTimeout(() => setShowPopularSearches(false), 200);
    }
  };

  const handlePopularSearchSelect = (term) => {
    setSearchState((prev) => ({ ...prev, searchKeyword: term }));
    setShowPopularSearches(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleMouseEnter = () => {
    setShowPopularSearches(true);
  };

  const handleMouseLeave = () => {
    if (!searchInputRef.current?.contains(document.activeElement)) {
      setShowPopularSearches(false);
    }
  };

  const handleResetFilters = () => {
    const tomorrow = addDays(new Date(), 1);
    const dayAfterTomorrow = addDays(new Date(), 2);

    setSearchState((prevState) => ({
      searchKeyword: "",
      peopleCount: 1,
      dateRange: {
        startDate: tomorrow,
        endDate: dayAfterTomorrow,
        key: "selection",
      },
      minPrice: 0,
      maxPrice: 500000,
      offers: [],
      bedrooms: 0,
      beds: 0,
      bathrooms: 0,
      sortOption: prevState.sortOption,
    }));
    setPriceRange([0, 500000]);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Paper
        elevation={3}
        sx={{ width: "75%", borderRadius: "20px", padding: "20px" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
            gap: 2,
          }}
        >
          <ClickAwayListener onClickAway={() => setShowPopularSearches(false)}>
            <Box
              sx={{ position: "relative", flexGrow: 12, minWidth: "35%" }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <TextField
                placeholder="시/도 및 시/군/구, 숙소 이름을 검색해주세요"
                value={searchKeyword}
                onChange={(e) =>
                  setSearchState((prev) => ({
                    ...prev,
                    searchKeyword: e.target.value,
                  }))
                }
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                inputRef={searchInputRef}
                fullWidth
                sx={{ "& .MuiInputBase-root": { height: "56px" } }}
              />
              {showPopularSearches && (
                <div ref={popularKeywordsRef}>
                  <PopularKeywords onSelect={handlePopularSearchSelect} />
                </div>
              )}
            </Box>
          </ClickAwayListener>
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            sx={{ flexGrow: 1, minWidth: "20%", maxWidth: "30%" }}
          />
          <FormControl sx={{ flexGrow: 2, minWidth: "10%" }}>
            <InputLabel id="people-count-label">인원 수</InputLabel>
            <Select
              labelId="people-count-label"
              value={peopleCount}
              onChange={(e) =>
                setSearchState((prev) => ({
                  ...prev,
                  peopleCount: e.target.value,
                }))
              }
              label="인원 수"
            >
              {renderPersonMenuItems(10)}
            </Select>
          </FormControl>
          <Tooltip title={isExpanded ? "필터 닫기" : "더 많은 필터"}>
            <IconButton
              onClick={handleExpandClick}
              aria-label="필터"
              size="large"
              sx={{
                width: "56px",
                height: "56px",
                border: "1px solid #e0e0e0",
                borderRadius: "50%",
                color: "#2AAADE",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              {isExpanded ? (
                <FilterAltOffTwoToneIcon />
              ) : (
                <FilterAltTwoToneIcon />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="검색하기">
            <IconButton
              onClick={handleSubmit}
              aria-label="검색"
              size="large"
              sx={{
                backgroundColor: "#87CEEB",
                color: "white",
                "&:hover": { backgroundColor: "#2AAADE" },
                width: "56px",
                height: "56px",
              }}
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {isExpanded && (
          <Box sx={{ marginTop: "20px" }}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              가격 범위
            </Typography>
            <Box sx={{ px: 2, pb: 2 }}>
              <Slider
                value={priceRange}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="off"
                min={0}
                max={500000}
                step={10000}
                sx={{
                  color: "#87CEEB",
                  "& .MuiSlider-thumb": {
                    backgroundColor: "#87CEEB",
                  },
                  "& .MuiSlider-rail": {
                    backgroundColor: "#bdbdbd",
                  },
                  "& .MuiSlider-track": {
                    border: "none",
                  },
                  "&:hover": {
                    "& .MuiSlider-thumb": {
                      backgroundColor: "#2AAADE",
                    },
                    "& .MuiSlider-track": {
                      backgroundColor: "#2AAADE",
                    },
                  },
                }}
              />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography>최저 가격: {formatPrice(priceRange[0])}</Typography>
                <Typography>최고 가격: {formatPrice(priceRange[1])}</Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              숙소 세부 정보
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="subtitle1" gutterBottom>
                  침실
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={bedrooms}
                    onChange={(e) =>
                      setSearchState((prev) => ({
                        ...prev,
                        bedrooms: e.target.value,
                      }))
                    }
                  >
                    {renderRoomMenuItems(5)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle1" gutterBottom>
                  침대
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={beds}
                    onChange={(e) =>
                      setSearchState((prev) => ({
                        ...prev,
                        beds: e.target.value,
                      }))
                    }
                  >
                    {renderRoomMenuItems(5)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle1" gutterBottom>
                  화장실
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={bathrooms}
                    onChange={(e) =>
                      setSearchState((prev) => ({
                        ...prev,
                        bathrooms: e.target.value,
                      }))
                    }
                  >
                    {renderRoomMenuItems(5)}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              편의시설 및 서비스
            </Typography>
            <Grid container spacing={2}>
              {offerList.map((offer) => (
                <Grid item key={offer.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={offers.includes(offer.id)}
                        onChange={() => handleOfferChange(offer.id)}
                      />
                    }
                    label={offer.name}
                  />
                </Grid>
              ))}
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "right",
                alignItems: "center",
                mb: 2,
                mr: 1,
              }}
            >
              <Button
                startIcon={<RefreshRoundedIcon />}
                onClick={handleResetFilters}
                sx={{ color: "#2AAADE" }}
                variant="outlined"
              >
                모든 필터 초기화
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </div>
  );
};

export default SearchBar;
