import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import "./SearchInput.css";

const SearchStyle = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));


export default function SearchInput({ value, onChange }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
        <div className="searchToolbar" >
          <div className="searchWrapper">
            <div className="searchIconWrapper">
              <SearchIcon />
            </div>
            <InputBase
              className="inputBase"
              placeholder="Search…"
              value={value}
              onChange={onChange}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
        </div>
    </Box>
  );
}
