import { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchSpaces } from "../api/space";
import Pagination from "@mui/material/Pagination";
import SpaceCardList from "../components/SpaceCardList";
import SearchBar from "../components/SearchBar";
import { Box, CircularProgress } from "@mui/material";
import { useSearch } from "../hooks/useSearch";

const SearchResultPage = () => {
  const { searchState, updateSearchState } = useSearch();
  const location = useLocation();
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const currentPage = useMemo(
    () => parseInt(queryParams.get("page"), 10) || 1,
    [queryParams]
  );

  const currentSort = useMemo(() => {
    const sortParam = queryParams.get("sort");
    switch (sortParam) {
      case "rating":
        return 0;
      case null:
      case "":
        return 1;
      case "price,asc":
        return 2;
      case "price,desc":
        return 3;
      case "popular":
        return 4;
      default:
        return 0;
    }
  }, [queryParams]);

  useEffect(() => {
    updateSearchState({ sortOption: currentSort });
  }, [currentSort, updateSearchState]);

  const getSortParam = (option) => {
    switch (option) {
      case 0:
        return "rating";
      case 1:
        return null;
      case 2:
        return "price,asc";
      case 3:
        return "price,desc";
      case 4:
        return "popular";
      default:
        return "rating";
    }
  };

  const fetchResults = useCallback(
    async (page) => {
      setIsLoading(true);
      const searchParams = new URLSearchParams(queryParams);
      searchParams.set("page", page - 1);
      searchParams.set("size", 12);
      const sortParam = getSortParam(searchState.sortOption);
      if (sortParam) {
        searchParams.set("sort", sortParam);
      } else {
        searchParams.delete("sort");
      }

      try {
        const response = await searchSpaces(searchParams);
        setSpaces(response.content);
        setTotalPages(response.totalPages);
      } catch (error) {
        if (error.response.data.msg) {
          alert(error.response.data.msg);
        } else {
          alert("공간 정보를 불러올 수 없습니다.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [queryParams, searchState.sortOption]
  );

  useEffect(() => {
    if (location.search) {
      fetchResults(currentPage);
    }
  }, [location.search, currentPage, fetchResults]);

  const handleSortChange = (newSortOption) => {
    updateSearchState({ sortOption: newSortOption });
    const newParams = new URLSearchParams(queryParams);
    const sortParam = getSortParam(newSortOption);
    if (sortParam) {
      newParams.set("sort", sortParam);
    } else {
      newParams.delete("sort");
    }
    newParams.set("page", 1);
    navigate({ search: newParams.toString() }, { replace: true });
  };

  const handlePageChange = (e, value) => {
    if (value !== currentPage) {
      const newParams = new URLSearchParams(queryParams);
      newParams.set("page", value);
      navigate({ search: newParams.toString() }, { replace: true });
    }
  };

  return (
    <div style={{ marginTop: "100px" }}>
      <SearchBar />
      <div style={{ marginTop: "1%" }}>
        {isLoading ? (
          <Box
            my={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
          >
            <CircularProgress sx={{ color: "#87CEEB" }} />
          </Box>
        ) : (
          <>
            <SpaceCardList
              spaces={spaces}
              onSortChange={handleSortChange}
              currentSortOption={searchState.sortOption}
            />
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                sx={{ mb: 1 }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResultPage;
