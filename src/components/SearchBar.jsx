import { Box, IconButton, Paper, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PeopleCountDropdown from "./PeopleCountDropdown";
import { useState } from "react";
import DateRangePicker from "./DateRangePicker";
import { addDays, startOfTomorrow } from "date-fns";
import SidoDropdown from "./SidoDropdown";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchSido, setSearchSido] = useState("전체");
  const [peopleCount, setPeopleCount] = useState(1);
  const [dateRange, setDateRange] = useState({
    startDate: startOfTomorrow(),
    endDate: addDays(startOfTomorrow(), 1),
    key: "selection",
  });
  const navigate = useNavigate();

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    const sido = searchSido === "전체" ? null : searchSido;

    const formattedStartDate = formatDate(dateRange.startDate);
    const formattedEndDate = formatDate(dateRange.endDate);

    if (formattedStartDate === formattedEndDate) {
      alert(
        "체크인과 체크아웃 날짜가 같을 수 없습니다. 다른 날짜를 선택해주세요."
      );
      return;
    }

    const queryParam = new URLSearchParams({
      checkIn: formattedStartDate,
      checkOut: formattedEndDate,
      headCount: peopleCount,
      page: 1,
      ...(sido && { sido: sido }),
    });

    navigate(`/space.search?${queryParam.toString()}`);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "10vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          borderRadius: "50px",
          maxWidth: "70%",
          width: "80%",
        }}
      >
        <Box
          sx={{
            marginLeft: "2%",
            flex: "0 0 20%",
            borderRight: "1px solid #e0e0e0",
            padding: "0 10px",
            height: "40px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <SidoDropdown sido={searchSido} setSido={setSearchSido} />
        </Box>

        <Box
          sx={{
            borderLeft: "1px solid #e0e0e0",
            flex: "0 0 40%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 10px",
            height: "40px",
            overflow: "hidden",
          }}
        >
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            sx={{ width: "100%" }}
          />
        </Box>
        <Box
          sx={{
            flex: "0 0 20%",
            borderLeft: "1px solid #e0e0e0",
            borderRight: "1px solid #e0e0e0",
            padding: "0 10px",
            height: "40px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <PeopleCountDropdown count={peopleCount} setCount={setPeopleCount} />
        </Box>
        <Tooltip title="검색하기">
          <IconButton
            onClick={handleSubmit}
            aria-label="검색"
            size="large"
            sx={{
              marginLeft: "2%",
              flex: "0 0 auto",
              backgroundColor: "#87CEEB",
              color: "white",
              borderRadius: "50%",
              "&:hover": { backgroundColor: "#2AAADE" },
              height: "50px",
              width: "50px",
            }}
          >
            <SearchIcon />
          </IconButton>
        </Tooltip>
      </Paper>
    </div>
  );
};

export default SearchBar;
