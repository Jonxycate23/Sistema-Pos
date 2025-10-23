import { create } from "zustand";
import { Light, Dark, Blue, Green, Purple, Red } from "../styles/themes";

const themeMap = {
  light: Light,
  dark: Dark,
  blue: Blue,
  green: Green,
  purple: Purple,
  red: Red,
};

export const useThemeStore = create((set, get) => ({
  theme: localStorage.getItem("theme") || "light",
  themeStyle: themeMap[localStorage.getItem("theme")] || Light,

  setTheme: (themeName) => {
    const style = themeMap[themeName] || Light;
    set({ theme: themeName, themeStyle: style });
    localStorage.setItem("theme", themeName);
  },

  toggleTheme: () => {
    const current = get().theme;
    const order = ["light", "dark", "blue", "green", "purple", "red"];
    const next = order[(order.indexOf(current) + 1) % order.length];
    const style = themeMap[next];
    set({ theme: next, themeStyle: style });
    localStorage.setItem("theme", next);
  },
}));
