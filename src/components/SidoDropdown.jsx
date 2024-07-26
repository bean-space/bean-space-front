import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const SidoDropdown = ({ sido, setSido }) => {
  const handleChange = (e) => {
    setSido(e.target.value);
  };

  const options = [
    { display: "전체", value: "전체" },
    { display: "서울", value: "서울특별시" },
    { display: "제주", value: "제주특별자치도" },
    { display: "부산", value: "부산광역시" },
    { display: "인천", value: "인천광역시" },
    { display: "대구", value: "대구광역시" },
    { display: "대전", value: "대전광역시" },
    { display: "광주", value: "광주광역시" },
    { display: "울산", value: "울산광역시" },
    { display: "세종", value: "세종특별자치시" },
    { display: "경기", value: "경기도" },
    { display: "충북", value: "충청북도" },
    { display: "충남", value: "충청남도" },
    { display: "전북", value: "전북특별자치도" },
    { display: "전남", value: "전라남도" },
    { display: "경북", value: "경상북도" },
    { display: "경남", value: "경상남도" },
    { display: "강원", value: "강원특별자치도" },
  ];

  return (
    <FormControl fullWidth>
      <InputLabel id="sido-label">방문할 지역</InputLabel>
      <Select
        labelId="sido-label"
        id="sido-select"
        value={sido}
        label="방문할 지역"
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

export default SidoDropdown;
