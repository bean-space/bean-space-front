import { Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        일: Math.floor(difference / (1000 * 60 * 60 * 24)),
        시간: Math.floor((difference / (1000 * 60 * 60)) % 24),
        분: Math.floor((difference / 1000 / 60) % 60),
        초: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span key={interval}>
        {timeLeft[interval]}
        {interval}{" "}
      </span>
    );
  });

  return (
    <Box>
      <Typography variant="body2" align="center" gutterBottom>
        쿠폰 발급까지 남은 시간
      </Typography>
      <Typography
        variant="body1"
        align="center"
        fontWeight="bold"
        sx={{ color: "#F17D7B" }}
      >
        {timerComponents.length ? timerComponents : <span>발급 시작!</span>}
      </Typography>
    </Box>
  );
};

export default CountdownTimer;
