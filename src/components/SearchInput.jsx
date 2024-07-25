import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchInput = ({ searchQuery, setSearchQuery, maxLength = 20 }) => {
  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setSearchQuery(value);
    }
  };

  return (
    <TextField
      placeholder={"여행지를 입력하세요"}
      value={searchQuery}
      onChange={handleSearchChange}
      variant="standard"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
        disableUnderline: true,
      }}
      sx={{
        minWidth: "150px",
        "& input": {
          padding: "8px 0",
        },
      }}
    />
  );
};

export default SearchInput;
