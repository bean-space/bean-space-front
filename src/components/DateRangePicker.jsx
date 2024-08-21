import { useState, useEffect, useRef } from "react";
import { DateRange } from "react-date-range";
import { addDays, addMonths, format, isBefore, isAfter } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { ko } from "date-fns/locale";
import { Box, Typography, Divider } from "@mui/material";

const DateRangePicker = ({ dateRange, onDateRangeChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);
  const [currentDateRange, setCurrentDateRange] = useState(dateRange);

  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;

    if (!currentDateRange.startDate) {
      setCurrentDateRange({ ...currentDateRange, startDate });
    } else if (!currentDateRange.endDate) {
      if (
        isAfter(endDate, currentDateRange.startDate) &&
        !isDateDisabled(endDate)
      ) {
        setCurrentDateRange({ ...currentDateRange, endDate });
        onDateRangeChange({ startDate: currentDateRange.startDate, endDate });
        setShowCalendar(false);
      }
    }
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isBefore(date, today)) return true;

    const sixMonthsLater = addDays(addMonths(today, 6), -1);
    if (isAfter(date, sixMonthsLater)) return true;

    if (!currentDateRange.startDate) {
      return false;
    } else {
      return isBefore(date, addDays(currentDateRange.startDate, 1));
    }
  };

  const handleCalendarOpen = () => {
    setCurrentDateRange({ startDate: null, endDate: null, key: "selection" });
    setShowCalendar(true);
  };

  const handleClickOutside = (event) => {
    if (calendarRef.current && !calendarRef.current.contains(event.target)) {
      setShowCalendar(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Box
      sx={{
        alignContent: "center",
        width: "100%",
      }}
    >
      <Box
        onClick={handleCalendarOpen}
        sx={{
          cursor: "pointer",
          padding: "10px",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box flex={1} sx={{ textAlign: "center" }}>
            <Typography variant="caption" color="textSecondary">
              체크인
            </Typography>
            <Typography>
              {dateRange.startDate
                ? format(dateRange.startDate, "yyyy년 MM월 dd일", {
                    locale: ko,
                  })
                : "날짜 선택"}
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
          <Box flex={1} sx={{ textAlign: "center" }}>
            <Typography variant="caption" color="textSecondary">
              체크아웃
            </Typography>
            <Typography>
              {dateRange.endDate
                ? format(dateRange.endDate, "yyyy년 MM월 dd일", { locale: ko })
                : "날짜 선택"}
            </Typography>
          </Box>
        </Box>
      </Box>
      {showCalendar && (
        <Box
          ref={calendarRef}
          sx={{
            position: "absolute",
            zIndex: 2,
            left: "50%",
            transform: "translateX(-50%)",
            mt: 1,
            boxShadow: 3,
          }}
        >
          <DateRange
            ranges={[currentDateRange]}
            onChange={handleSelect}
            minDate={addDays(new Date(), 1)}
            maxDate={addMonths(new Date(), 6)}
            months={2}
            direction="horizontal"
            locale={ko}
            dateDisplayFormat="yyyy년 MM월 dd일"
            disabledDay={isDateDisabled}
            startDatePlaceholder="체크인"
            endDatePlaceholder="체크아웃"
            rangeColors={["#87CEEB"]}
          />
        </Box>
      )}
    </Box>
  );
};

export default DateRangePicker;
