import { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchSpaces } from "../api/space";
import Pagination from "@mui/material/Pagination";
import SpaceCardList from "../components/SpaceCardList";

const SearchResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const currentPage = useMemo(
    () => parseInt(queryParams.get("page"), 10) || 1,
    [queryParams]
  );

  const fetchResults = useCallback(
    async (page) => {
      const searchParams = new URLSearchParams(queryParams);
      searchParams.set("page", page - 1);
      searchParams.set("size", 12);

      const response = await searchSpaces(searchParams);
      setSpaces(response.content);
      setTotalPages(response.totalPages);
    },
    [queryParams]
  );

  useEffect(() => {
    fetchResults(currentPage);
  }, [currentPage, fetchResults]);

  const handlePageChange = (e, value) => {
    if (value !== currentPage) {
      queryParams.set("page", value);
      navigate({ search: queryParams.toString() }, { replace: true });
    }
  };

  return (
    <div style={{ margin: "100px 0 0 0" }}>
      <SpaceCardList spaces={spaces} />
      <div
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </div>
  );
};

export default SearchResultPage;
