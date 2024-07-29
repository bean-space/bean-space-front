import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import LogoSrc from "../assets/logo.svg";
import VpnKeyTwoToneIcon from "@mui/icons-material/VpnKeyTwoTone";
import { useAuth } from "../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import defaultProfile from "../assets/default_profile_image.webp";

function Header() {
  const { role } = useAuth();

  switch (role) {
    case "MEMBER":
      return <MemberHeader />;
    case "HOST":
      return <HostHeader />;
    case "ADMIN":
      return <AdminHeader />;
    case null:
      return <LoggedOutHeader />;
    default:
      return <LoggedOutHeader />;
  }
}

const LoggedOutHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginClick = () => {
    if (location.pathname !== "/login") {
      localStorage.setItem("previousUrl", location.pathname);
    }
    navigate("/login");
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#F7EFDC" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to={"/"} style={{ textDecoration: "none" }}>
            <img
              src={LogoSrc}
              alt="Logo"
              style={{ height: 40, marginRight: 5 }}
            />
          </Link>
          <Link to={"/"} style={{ textDecoration: "none" }}>
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                color: "black",
                textDecoration: "none",
                marginRight: 10,
              }}
            >
              빈 공간 - Bean Space
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            onClick={handleLoginClick}
            variant="contained"
            endIcon={<VpnKeyTwoToneIcon />}
            color="success"
            sx={{
              color: "#405761",
              bgcolor: "#87CEEB",
              textShadow: "0.5px 0.5px 2px #EEE",
              "&:hover": { backgroundColor: "#2AAADE" },
            }}
          >
            로그인
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const MemberHeader = () => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { logout, profileImageUrl, nickname } = useAuth();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
  };

  const memberSettings = ["내 예약", "내 프로필", "로그아웃"];

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#F7EFDC" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to={"/"} style={{ textDecoration: "none" }}>
            <img
              src={LogoSrc}
              alt="Logo"
              style={{ height: 40, marginRight: 5 }}
            />
          </Link>
          <Link to={"/"} style={{ textDecoration: "none" }}>
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                color: "black",
                textDecoration: "none",
                marginRight: 10,
              }}
            >
              빈 공간 - Bean Space
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="메뉴">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt={nickname} src={profileImageUrl || defaultProfile} />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {memberSettings.map((setting) => (
              <MenuItem
                key={setting}
                onClick={
                  setting === "로그아웃" ? handleLogout : handleCloseUserMenu
                }
              >
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const HostHeader = () => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { logout, profileImageUrl, nickname } = useAuth();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
  };

  const hostPages = ["예약", "공간", "통계"];
  const hostSettings = ["내 예약", "내 프로필", "로그아웃"];

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#F7EFDC" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to={"/"} style={{ textDecoration: "none" }}>
            <img
              src={LogoSrc}
              alt="Logo"
              style={{ height: 40, marginRight: 5 }}
            />
          </Link>
          <Link to={"/"} style={{ textDecoration: "none" }}>
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                color: "black",
                textDecoration: "none",
                marginRight: 10,
              }}
            >
              빈 공간 - Bean Space
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "row" }}>
            {hostPages.map((page) => (
              <Button
                key={page}
                sx={{
                  my: 2,
                  color: "black",
                  display: "block",
                  mx: 2,
                  fontSize: "1.10rem",
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0, ml: 2 }}>
            <Tooltip title="메뉴">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={nickname}
                  src={profileImageUrl || defaultProfile}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {hostSettings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={
                    setting === "로그아웃" ? handleLogout : handleCloseUserMenu
                  }
                >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const AdminHeader = () => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { logout, profileImageUrl, nickname } = useAuth();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
  };

  const adminPages = ["공간", "쿠폰"];
  const adminSettings = ["내 프로필", "로그아웃"];

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#F7EFDC" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to={"/"} style={{ textDecoration: "none" }}>
            <img
              src={LogoSrc}
              alt="Logo"
              style={{ height: 40, marginRight: 5 }}
            />
          </Link>
          <Link to={"/"} style={{ textDecoration: "none" }}>
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                color: "black",
                textDecoration: "none",
                marginRight: 10,
              }}
            >
              빈 공간 - Bean Space
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "row" }}>
            {adminPages.map((page) => (
              <Button
                key={page}
                sx={{
                  my: 2,
                  color: "black",
                  display: "block",
                  mx: 2,
                  fontSize: "1.10rem",
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0, ml: 2 }}>
            <Tooltip title="메뉴">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={nickname}
                  src={profileImageUrl || defaultProfile}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {adminSettings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={
                    setting === "로그아웃" ? handleLogout : handleCloseUserMenu
                  }
                >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
