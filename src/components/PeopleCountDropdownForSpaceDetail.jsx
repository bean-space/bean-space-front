import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const PeopleCountDropdownForSpaceDetail = ({ count, setCount, maxPeople }) => {
  const handleChange = (e) => {
    setCount(e.target.value);
  };

  const options = Array.from({ length: maxPeople }, (_, i) => ({
    display: `${i + 1}명`,
    value: i + 1,
  }));

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

export default PeopleCountDropdownForSpaceDetail;
