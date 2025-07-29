import { createContext, useContext, useEffect } from "react";
import PropTypes from 'prop-types';

// Create and export the context
export const ThemeContext = createContext({
  theme: "light"
});

export const ThemeProvider = ({ children }) => {
  // Only light theme as requested
  const theme = "light";

  useEffect(() => {
    // Ensure light theme is applied
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");

    // Set body background and text color using CSS variables
    document.body.style.background = "var(--bg-main)";
    document.body.style.color = "var(--text-main)";

    localStorage.setItem("theme", "light");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// PropTypes validation
ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Custom hook for accessing theme context
export const useTheme = () => useContext(ThemeContext);