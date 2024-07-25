import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const PeopleCountDropdown = ({ count, setCount }) => {
  const handleChange = (e) => {
    setCount(e.target.value);
  };

  const options = [
    { display: "1명", value: 1 },
    { display: "2명", value: 2 },
    { display: "3명", value: 3 },
    { display: "4명", value: 4 },
    { display: "5명", value: 5 },
    { display: "6명", value: 6 },
    { display: "7명", value: 7 },
    { display: "8명", value: 8 },
    { display: "9명", value: 9 },
    { display: "10명+", value: 10 },
  ];

  return (
    <FormControl fullWidth>
      <InputLabel id="people-count-label">인원 수</InputLabel>
      <Select
        labelId="people-count-label"
        id="people-count-select"
        value={count}
        label="인원 수"
        onChange={handleChange}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.display}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default PeopleCountDropdown;
