import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  typography: {
    fontFamily: [
      "Pretendard",
      "-apple-system",
      "BlinkMacSystemFont",
      "system-ui",
      "Roboto",
      '"Helvetica Neue"',
      '"Segoe UI"',
      '"Apple SD Gothic Neo"',
      '"Noto Sans KR"',
      '"Malgun Gothic"',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      "sans-serif",
    ].join(","),
  },
});

const ThemeWrapper = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default ThemeWrapper;
