import { useState, useEffect, useRef } from "react";
import { DateRange } from "react-date-range";
import { addDays, addMonths, format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { ko } from "date-fns/locale";

const DateRangePicker = ({ dateRange, onDateRangeChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  const handleSelect = (ranges) => {
    onDateRangeChange(ranges.selection);
  };

  const handleClickOutside = (e) => {
    if (calendarRef.current && !calendarRef.current.contains(e.target)) {
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
    <div>
      <div
        onClick={() => setShowCalendar(true)}
        style={{
          cursor: "pointer",
          padding: "10px",
        }}
      >
        {`${format(dateRange.startDate, "yyyy년 MM월 dd일", {
          locale: ko,
        })} - ${format(dateRange.endDate, "yyyy년 MM월 dd일", {
          locale: ko,
        })}`}
      </div>
      {showCalendar && (
        <div
          ref={calendarRef}
          style={{
            position: "absolute",
            zIndex: 2,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <DateRange
            ranges={[dateRange]}
            onChange={handleSelect}
            minDate={addDays(new Date(), 1)}
            maxDate={addMonths(new Date(), 6)}
            moveRangeOnFirstSelection={false}
            months={2}
            direction="horizontal"
            locale={ko}
            dateDisplayFormat="yyyy년 MM월 dd일"
          />
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
