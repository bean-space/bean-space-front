import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import HostSpaceList from "../components/HostSpaceList";
import { deleteSpace, getHostSpaceList } from "../api/host";

const HostSpacePage = () => {
  const { role, isLoggedIn } = useAuth();
  const [spaces, setSpaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [spaceToDelete, setSpaceToDelete] = useState(null);

  const fetchSpaces = async () => {
    try {
      const data = await getHostSpaceList();
      setSpaces(data);
    } catch (error) {
      alert("공간 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn || role !== "HOST") {
      alert("호스트만 접근할 수 있는 페이지입니다.");
      navigate("/");
    }
  }, [isLoading, isLoggedIn, role, navigate]);

  useEffect(() => {
    if (isLoggedIn && role === "HOST") {
      fetchSpaces();
    }
  }, []);

  const handleEdit = (spaceId) => {
    const spaceToEdit = spaces.find((space) => space.id === spaceId);

    navigate(`/host/space/edit/${spaceId}`, {
      state: { spaceData: spaceToEdit },
    });
  };

  const handleDeleteClick = (spaceId) => {
    setSpaceToDelete(spaceId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (spaceToDelete) {
      try {
        await deleteSpace(spaceToDelete);
        alert("공간이 삭제되었습니다");
        setSpaces(spaces.filter((space) => space.id !== spaceToDelete));
      } catch (error) {
        if (error.response && error.response.data && error.response.data.msg) {
          alert(error.response.data.msg);
        } else {
          alert("공간 삭제에 실패했습니다.");
        }
      }
    }
    setOpenDeleteDialog(false);
    setSpaceToDelete(null);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setSpaceToDelete(null);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress sx={{ color: "#87CEEB" }} />
      </Box>
    );
  }

  if (!isLoggedIn || role !== "HOST") {
    return null;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Container maxWidth="xl" sx={{ flex: 1, margin: "90px 0 0 0" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ ml: 2, flexGrow: 1 }}>
            내 공간 목록
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/host/space/register"
            sx={{
              fontSize: "1rem",
              textShadow: "#000 0.7px 0.5px 2px",
              backgroundColor: "#87CEEB",
              "&:hover": { backgroundColor: "#2AAADE" },
              ml: 2,
              mr: 5,
            }}
          >
            새 공간 등록하기
          </Button>
        </Box>

        <HostSpaceList
          spaces={spaces}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        <Dialog
          open={openDeleteDialog}
          onClose={handleDeleteCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"공간 삭제 확인"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              정말로 이 공간을 삭제하시겠습니까?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} color="primary">
              취소
            </Button>
            <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
              삭제
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default HostSpacePage;
