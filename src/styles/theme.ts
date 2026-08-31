import { createTheme } from "styled-components";

export const theme = createTheme(
  {
    color: {
      bg: "#FFFEFA",
      surface: "#f6f7f9",
      "surface-raised": "#ffffff",
      fg: "#191919",
      "fg-muted": "#5c636e",
      border: "#191919",
      accent: "#1662d4",
      "accent-hover": "#0f4ba8",
      "accent-fg": "#ffffff",
      focus: "#1662d4",
    },
    space: {
      1: "0.25rem",
      2: "0.5rem",
      3: "0.75rem",
      4: "1rem",
      5: "1.5rem",
      6: "2rem",
      7: "3rem",
      8: "4rem",
      9: "6.25rem",
    },
    radius: {
      sm: "4px",
      md: "6px",
      lg: "16px",
      xl: "24px",
      full: "9999px",
    },
    font: {
      sans: "Aeonik, sans-serif",
    },
    "font-weight": {
      normal: "400",
      medium: "500",
      bold: "700",
    },
    "font-size": {
      "1rem": "16px",
      h1: "3.5rem",
      h2: "2.5rem",
      h3: "2rem",
    },
    "line-height": {
      tight: "1.2",
      normal: "1.5",
      heading: "1.143",
    },
    "letter-spacing": {
      tight: "-.8px",
      normal: "0px",
    },
    breadcrumbs: {
      fontSize: "1.25rem",
    },
    container: {
      max: "90rem",
    },
    row: {
      bg: "linear-gradient(75.01deg, #FFFEFA -65.58%, #F6F1E7 29.37%, #E8DCC7 217.98%)",
    },
    carousel: {
      caption: {
        bg: "#F6F1E7",
      },
      dot: {
        width: "75px",
        height: "5px",
        bg: "rgba(255, 255, 255, 0.75)",
        activeBg: "#FFFEFA",
      },
      control: {
        bg: "#F6F1E7",
      },
    },
    footer: {
      bg: "#191919",
      color: "#fffefa",
      border: "rgb(255, 254, 250, .2)",
      fontSize: ".875rem",
    },
    transition: {
      fast: ".125s ease-in-out",
      medium: ".250s ease-in-out",
      slow: ".500s ease-in-out",
    },
  },
  { prefix: "sc", selector: ":root" },
);
