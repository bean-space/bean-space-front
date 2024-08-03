import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Pagination,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { getRequestAddSpace, updateSpaceStatus } from "../api/admin";
import AdminSpaceApprovalList from "./AdminSpaceApprovalList";
import HourglassBottomTwoToneIcon from "@mui/icons-material/HourglassBottomTwoTone";
import DoNotTouchTwoToneIcon from "@mui/icons-material/DoNotTouchTwoTone";

const SpaceApprovalContainer = () => {
  const [spaces, setSpaces] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState("PENDING");
  const size = 12;

  const fetchSpaces = useCallback(async () => {
    try {
      const queryParams = {
        page: page - 1,
        size,
        sort: "createdAt,ASC",
        status,
      };
      const data = await getRequestAddSpace(queryParams);
      setSpaces(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      alert("데이터를 불러올 수 없습니다");
    }
  }, [page, status, size]);

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleStatusChange = (event, newStatus) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handleApprove = async (id) => {
    try {
      await updateSpaceStatus({ id: id, status: { status: "ACTIVE" } });
      alert("공간이 정상적으로 승인되었습니다");
      fetchSpaces();
    } catch (error) {
      if (error.response.data.msg) {
        alert(error.response.data.msg);
      } else {
        alert("승인 처리 중 오류가 발생했습니다");
      }
    }
  };

  const handleReject = async (id) => {
    try {
      await updateSpaceStatus({ id: id, status: { status: "REJECTED" } });
      alert("공간 승인이 정상적으로 거절되었습니다");
      fetchSpaces();
    } catch (error) {
      if (error.response.data.msg) {
        alert(error.response.data.msg);
      } else {
        alert("거절 처리 중 오류가 발생했습니다");
      }
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ padding: 1 }}>
        <Typography variant="h4" gutterBottom>
          공간 승인 페이지
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Tabs
            value={status}
            onChange={handleStatusChange}
            sx={{
              "& .Mui-selected": {
                color: "#2AAADE",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#2AAADE",
              },
            }}
          >
            <Tab
              label="승인 대기"
              value="PENDING"
              icon={<HourglassBottomTwoToneIcon />}
            />
            <Tab
              label="승인 거절"
              value="REJECTED"
              icon={<DoNotTouchTwoToneIcon />}
            />
          </Tabs>
        </Box>
        <AdminSpaceApprovalList
          spaces={spaces}
          onApprove={handleApprove}
          onReject={handleReject}
        />
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Box>
    </Container>
  );
};

export default SpaceApprovalContainer;
