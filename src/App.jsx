import styled, { ThemeProvider } from "styled-components";
import {
  AuthContextProvider,
  GlobalStyles,
  MyRoutes,
  useThemeStore,
  useUsuariosStore,
  Light,
  Dark,
} from "./index";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  const { themeStyle, setTheme } = useThemeStore();
  const { datausuarios } = useUsuariosStore();
  const location = useLocation();

  useEffect(() => {
  if (location.pathname === "/login") {
    setTheme("light");
  } else {
    // Solo setea el tema si no hay tema en localStorage
    if (!localStorage.getItem("theme")) {
      setTheme(datausuarios?.tema || "light");
    }
  }
}, [datausuarios, location]);


  return (
    <ThemeProvider theme={themeStyle}>
      <AuthContextProvider>
        <GlobalStyles />
        <MyRoutes />
        {/* <ReactQueryDevtools initialIsOpen={true} /> */}
      </AuthContextProvider>
    </ThemeProvider>
  );
}

export default App;
