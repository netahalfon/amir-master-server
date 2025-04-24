import React from "react";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { useColorMode } from "../context/ColorModeProvider"; // או ThemeProvider אם את משתמשת בשם הזה

const StyledSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' height='20' width='20' viewBox='0 0 20 20'><path fill='white' d='M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zM19.2 10.8a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z'/></svg>")`,
      },
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        opacity: 1,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' height='20' width='20' viewBox='0 0 20 20'><path fill='white' d='M9.3 1.7v2.1h1.4V1.7H9.3zM4.6 3.6l-1 1L5.1 6.1l1-1-1.5-1.5zm10.8 0l-1.5 1.5 1 1 1.5-1.5-1-1zM10 5.1A4.87 4.87 0 005.1 10 4.87 4.87 0 0010 14.9 4.87 4.87 0 0014.9 10 4.87 4.87 0 0010 5.1zM10 6.5A3.46 3.46 0 0113.5 10 3.46 3.46 0 0110 13.5 3.46 3.46 0 016.5 10 3.46 3.46 0 0110 6.5zM1.7 9.3v1.4h2.1V9.3H1.7zm14.6 0v1.4h2.1V9.3h-2.1zM5.1 13.9L3.6 15.4l1 1 1.5-1.5-1-1zm9.8 0l-1 1 1.5 1.5 1-1-1.5-1.5zM9.3 16.3v2.1h1.4v-2.1H9.3z'/></svg>")`,
    },
  },
  '& .MuiSwitch-track': {
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
    opacity: 1,
  },
}));

const ColorModeSwitch = () => {
  const { colorMode, setColorMode } = useColorMode();

  const handleChange = () => {
    setColorMode(colorMode === "light" ? "dark" : "light");
  };

  return (
    <StyledSwitch
      checked={colorMode === "dark"}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'color mode switch' }}
    />
  );
};

export default ColorModeSwitch;
