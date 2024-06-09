// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // Set dark mode
    background: {
      default: '#10162C', // Black background
      paper: '#202837',   // Dark gray background for MUI paper components
      alternate: '#333333',   // Black background for MUI paper components
    },
    text: {
      primary: '#ffffff', // White text
    },
  },
  typography: {
    allVariants: {
      color: '#ffffff', // Ensure all text variants are white
    },
  },
});

export default theme;
