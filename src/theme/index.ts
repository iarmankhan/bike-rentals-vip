// import type {} from "@mui/lab/themeAugmentation"; // this is useful if you want to override types of the theme
import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// A custom theme for this app
const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          color: "#fff",
        },
        outlined: {
          borderWidth: 2,
        },
        root: {
          boxShadow: "none",
          fontSize: "14px",
          lineHeight: "17px",
          padding: "10px 25px",
          // textTransform: 'none',
          fontWeight: "bold",
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          "&:before": {
            borderBottom: "1px solid rgba(0,0,0,0)",
          },
        },
        input: {
          borderRadius: "inherit",
        },
      },
    },
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },

  typography: {
    fontFamily: "Roboto, Arial",

    h1: {
      fontWeight: "bold",
      fontSize: "2.5rem",
    },
    h2: {
      fontWeight: "bold",
      fontSize: "2rem",
    },
    h3: {
      fontWeight: "bold",
      fontSize: "1.5rem",
    },
    h4: {
      fontWeight: "normal",
      fontSize: "1rem",
    },
    body1: {
      fontWeight: "normal",
      fontSize: "0.9rem",
    },
  },
  zIndex: {
    tooltip: 8,
  },
  palette: {
    primary: {
      main: "#80CCBF",
    },
    secondary: {
      main: "#6466AE",
    },
    error: {
      main: red.A400,
    },
    grey: {
      100: "#f2f3f5",
      800: "#c9c9dd",
      50: "#f8f8f8",
    },
    text: {
      primary: "#000",
    },
  },
});

export default theme;
