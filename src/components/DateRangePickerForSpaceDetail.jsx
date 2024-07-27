import { useState, useEffect, useRef } from "react";
import { DateRange } from "react-date-range";
import {
  addDays,
  addMonths,
  format,
  parseISO,
  isBefore,
  isAfter,
} from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { ko } from "date-fns/locale";
import { Box, Typography, Divider } from "@mui/material";

const DateRangePickerForSpaceDetail = ({
  initialCheckIn,
  initialCheckOut,
  reservedDateList,
  onDateRangeChange,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);
  const [dateRange, setDateRange] = useState({
    startDate: initialCheckIn
      ? initialCheckIn instanceof Date
        ? initialCheckIn
        : new Date(initialCheckIn)
      : null,
    endDate: initialCheckOut
      ? initialCheckOut instanceof Date
        ? initialCheckOut
        : new Date(initialCheckOut)
      : null,
    key: "selection",
  });

  const isDateReserved = (date) => {
    return reservedDateList.some(
      (reservedDate) =>
        format(new Date(reservedDate), "yyyy-MM-dd") ===
        format(date, "yyyy-MM-dd")
    );
  };

  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;

    if (!dateRange.startDate) {
      setDateRange({ ...dateRange, startDate });
    } else if (!dateRange.endDate) {
      if (isAfter(endDate, dateRange.startDate) && !isDateDisabled(endDate)) {
        setDateRange({ ...dateRange, endDate });
        onDateRangeChange({ startDate: dateRange.startDate, endDate });
        setShowCalendar(false);
      }
    }
  };

  const isDateDisabled = (date) => {
    if (isBefore(date, new Date())) return true;

    if (!dateRange.startDate) {
      return isDateReserved(date);
    } else {
      const nextReservedDate = reservedDateList
        .map((d) => parseISO(d))
        .filter((d) => isAfter(d, dateRange.startDate))
        .sort((a, b) => a - b)[0];

      return (
        isBefore(date, addDays(dateRange.startDate, 1)) ||
        (nextReservedDate && isAfter(date, nextReservedDate))
      );
    }
  };

  const handleCalendarOpen = () => {
    setDateRange({ startDate: null, endDate: null, key: "selection" });
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
    <Box>
      <Box
        onClick={handleCalendarOpen}
        sx={{
          cursor: "pointer",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box flex={1}>
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
          <Box flex={1}>
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
            ranges={[dateRange]}
            onChange={handleSelect}
            minDate={new Date()}
            maxDate={addMonths(new Date(), 6)}
            months={2}
            direction="horizontal"
            locale={ko}
            dateDisplayFormat="yyyy년 MM월 dd일"
            disabledDay={isDateDisabled}
            rangeColors={["#87CEEB"]}
            startDatePlaceholder="체크인"
            endDatePlaceholder="체크아웃"
          />
        </Box>
      )}
    </Box>
  );
};

export default DateRangePickerForSpaceDetail;
