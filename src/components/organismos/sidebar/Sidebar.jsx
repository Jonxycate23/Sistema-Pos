import styled from "styled-components";
import {
  LinksArray,
  SecondarylinksArray,
  useAuthStore,
  useThemeStore,
} from "../../../index";
import { v } from "../../../styles/variables";
import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useState } from "react";
// Importa tus temas si los usas directamente
// import { Light, Dark, Blue, Green, Purple, Red } from "../../../styles/themes";

export function Sidebar({ state, setState }) {
  const { cerrarSesion } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro que deseas cerrar sesión?")) {
      cerrarSesion();
    }
  };

  const themeOptions = [
    { name: "light", label: "Claro", color: "#fbbf24", icon: "solar:sun-bold-duotone" },
    { name: "dark", label: "Oscuro", color: "#3b82f6", icon: "solar:moon-stars-bold-duotone" },
    { name: "blue", label: "Azul", color: "#00A6FB", icon: "solar:waterdrop-bold-duotone" },
    { name: "green", label: "Verde", color: "#00FF85", icon: "solar:leaf-bold-duotone" },
    { name: "purple", label: "Púrpura", color: "#C77DFF", icon: "solar:waterdrop-bold-duotone" },
    { name: "red", label: "Rojo", color: "#FF4B4B", icon: "solar:fire-bold-duotone" },
  ];

  const iconosPersonalizados = {
    HOME: "solar:home-bold-duotone",
    PRODUCTOS: "mdi:shopping-outline",
    INVENTARIO: "solar:box-bold-duotone",
    VENDER: "solar:cart-large-4-bold-duotone",
    Menu: "solar:settings-bold-duotone",
    "MI PERFIL": "solar:user-circle-bold-duotone",
  };

  return (
    <Main $isopen={state.toString()}>
      <span className="Sidebarbutton" onClick={() => setState(!state)}>
        {<v.iconoflechaderecha />}
      </span>

      <Container $isopen={state.toString()} className={state ? "active" : ""}>
        {/* Logo */}
        <div className="Logocontent">
          <LogoWrapper $isopen={state.toString()}>
            <img src={v.logo} alt="Logo" />
          </LogoWrapper>
          <LogoText $isopen={state.toString()}>
            <h2>Cosecha Verde</h2>
            <span>Sistema POS</span>
          </LogoText>
        </div>

        {/* Links principales */}
        {LinksArray.map(({ icon, label, to }) => (
          <div className={state ? "LinkContainer active" : "LinkContainer"} key={label}>
            <NavLink to={to} className={({ isActive }) => `Links ${isActive ? "active" : ""}`}>
              <section className={state ? "content open" : "content"}>
                <Icon className="Linkicon" icon={iconosPersonalizados[label] || icon} />
                <span className={state ? "label_ver" : "label_oculto"}>{label}</span>
              </section>
            </NavLink>
          </div>
        ))}

        <Divider />

        {/* Links secundarios */}
        {SecondarylinksArray.map(({ icon, label, to, color }) => (
          <div className={state ? "LinkContainer active" : "LinkContainer"} key={label}>
            <NavLink to={to} className={({ isActive }) => `Links ${isActive ? "active" : ""}`}>
              <section className={state ? "content open" : "content"}>
                <Icon className="Linkicon" icon={iconosPersonalizados[label] || icon} style={{ color }} />
                <span className={state ? "label_ver" : "label_oculto"}>{label}</span>
              </section>
            </NavLink>
          </div>
        ))}

        <Divider />

        {/* Menú de selección de tema */}
        <div className={state ? "LinkContainer active" : "LinkContainer"}>
          <ThemeToggle className="Links" onClick={() => setShowThemeMenu(!showThemeMenu)}>
            <section className={state ? "content open" : "content"}>
              <Icon
                className="Linkicon theme-icon"
                icon={themeOptions.find((t) => t.name === theme)?.icon || "solar:sun-bold-duotone"}
              />
              <span className={state ? "label_ver" : "label_oculto"}>
                {themeOptions.find((t) => t.name === theme)?.label || "Tema"}
              </span>
            </section>
          </ThemeToggle>

          {showThemeMenu && (
            <ThemeMenu>
              {themeOptions.map((t) => (
                <ThemeOption
                  key={t.name}
                  style={{ background: t.color }}
                  title={t.label}
                  onClick={() => {
                    setTheme(t.name); // Solo pasa el nombre
                    setShowThemeMenu(false);
                  }}
                >
                  <Icon icon={t.icon} color="#fff" />
                </ThemeOption>
              ))}
            </ThemeMenu>
          )}
        </div>

        <Divider />

        {/* Cerrar sesión */}
        <div className={state ? "LinkContainer active" : "LinkContainer"}>
          <LogoutButton className="Links" onClick={handleLogout}>
            <section className={state ? "content open" : "content"}>
              <Icon className="Linkicon logout-icon" icon="solar:logout-2-bold-duotone" />
              <span className={state ? "label_ver" : "label_oculto"}>SALIR</span>
            </section>
          </LogoutButton>
        </div>
      </Container>
    </Main>
  );
}

// ===================== 🔧 ESTILOS =====================

const Container = styled.div`
  background: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  position: fixed;
  padding-top: 20px;
  z-index: 2;
  height: 100%;
  width: 88px;
  transition: 0.3s ease-in-out;
  overflow-y: auto;
  overflow-x: hidden;
  border-right: 1px solid ${({ theme }) => theme.color2};

  &.active {
    width: 280px;
  }

  .Logocontent {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 6px;
    gap: 6px;
  }

  .LinkContainer {
    margin: 7px 0;
    margin-right: 10px;
    margin-left: 8px;
    transition: all 0.3s ease-in-out;
    position: relative;
    text-transform: uppercase;
    font-weight: 700;
  }

  .sidebar-container {
    overflow-y: scroll;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
  }

  .sidebar-container::-webkit-scrollbar {
    display: none; /* Chrome, Safari y Opera */
  }

  .Links {
    border-radius: 12px;
    display: flex;
    align-items: center;
    text-decoration: none;
    width: 100%;
    color: ${({ theme }) => theme.text};
    height: 60px;
    position: relative;

    .content {
      display: flex;
      justify-content: center;
      width: 100%;
      align-items: center;

      .Linkicon {
        display: flex;
        font-size: 35px;
        filter: grayscale(100%) brightness(0.8);
        transition: all 0.3s ease;
      }

      .label_ver {
        transition: 0.3s ease-in-out;
        opacity: 1;
        display: initial;
        cursor: pointer;
      }

      .label_oculto {
        opacity: 0;
        display: none;
      }

      &.open {
        justify-content: start;
        gap: 20px;
        padding: 20px;
      }
    }

    &:hover {
      background: ${({ theme }) => theme.bgAlpha};
      transform: translateX(2px);

      .Linkicon {
        filter: grayscale(0%) brightness(1);
        transform: scale(1.05);
      }
    }

    &.active {
      background: ${({ theme }) => theme.bg6};
      border: 2px solid ${({ theme }) => theme.bg5};
      color: ${({ theme }) => theme.color1};
      font-weight: 600;

      .Linkicon {
        filter: grayscale(0%) brightness(1);
        transform: scale(1.05);
      }
    }
  }
`;

const Main = styled.div`
  .Sidebarbutton {
    position: fixed;
    top: 70px;
    left: 68px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${({ theme }) => theme.bgtgderecha};
    box-shadow: 0 0 4px ${({ theme }) => theme.bg3}, 0 0 7px ${({ theme }) => theme.bg};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    z-index: 3;
    transform: ${({ $isopen }) =>
      $isopen === "true" ? "translateX(191px) rotate(3.142rad)" : "initial"};
    color: ${({ theme }) => theme.text};
  }
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background: ${({ theme }) => theme.bg4};
  margin: ${({ theme }) => v.lgSpacing} 0;
`;

const LogoWrapper = styled.div`
  width: ${({ $isopen }) => ($isopen === "true" ? "60px" : "45px")};
  height: ${({ $isopen }) => ($isopen === "true" ? "60px" : "45px")};
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  padding: 5px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    animation: flotar 2s ease-in-out infinite alternate;
  }

  @keyframes flotar {
    0% {
      transform: translateY(0px);
    }
    100% {
      transform: translateY(-5px);
    }
  }
`;

const LogoText = styled.div`
  display: ${({ $isopen }) => ($isopen === "true" ? "flex" : "none")};
  flex-direction: column;
  gap: 2px;

  h2 {
    color: #f88533;
    margin: 0;
    font-size: 18px;
    font-weight: 800;
  }

  span {
    color: ${({ theme }) => theme.text};
    font-size: 11px;
    opacity: 0.7;
    font-weight: 600;
  }
`;

const ThemeToggle = styled.div`
  cursor: pointer;
  transition: all 0.3s ease;

  .theme-icon {
    color: ${({ theme }) => theme.colorToggle};
    filter: grayscale(0%) !important;
    animation: rotateSun 20s linear infinite;
  }

  @keyframes rotateSun {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const ThemeMenu = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  padding: 10px;
  background: ${({ theme }) => theme.bg3};
  border-radius: 10px;
  margin: 8px 16px;
  transition: all 0.3s ease;
`;

const ThemeOption = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
  }
`;

const LogoutButton = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;

  .logout-icon {
    color: #ef4444 !important;
    filter: grayscale(0%) !important;
  }

  &:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: #ef4444;
    transform: translateX(2px);

    .logout-icon {
      transform: scale(1.1);
      filter: drop-shadow(0 0 8px #ef4444) !important;
    }
  }

  &:active {
    transform: scale(0.98);
  }
`;
