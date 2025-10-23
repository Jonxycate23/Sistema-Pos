import styled, { ThemeProvider } from "styled-components";
import {
  AuthContextProvider,
  GlobalStyles,
  MyRoutes,
  useThemeStore,
  useUsuariosStore,
} from "./index";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function App() {
  const { themeStyle, setTheme } = useThemeStore();
  const { datausuarios } = useUsuariosStore();
  const location = useLocation();

  useEffect(() => {
    // 1️⃣ Intenta cargar el tema desde localStorage
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (datausuarios?.tema) {
      // 2️⃣ Si no hay nada en localStorage, usa el tema del usuario
      setTheme(datausuarios.tema);
    } else {
      // 3️⃣ Si no hay nada, usa "light" por defecto
      setTheme("light");
    }
  }, [datausuarios]);

  return (
    <ThemeProvider theme={themeStyle}>
      <AuthContextProvider>
        <GlobalStyles />
        <MyRoutes />
      </AuthContextProvider>
    </ThemeProvider>
  );
}

export default App;
