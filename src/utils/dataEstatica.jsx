import { v } from "../styles/variables";

// === MENÚ DESPLEGABLE DEL USUARIO ===
export const DesplegableUser = [
  {
    text: "Mi perfil",
    icono: <v.iconoUser />,
    tipo: "miperfil",
  },
  {
    text: "Configuración",
    icono: <v.iconoSettings />,
    tipo: "configuracion",
  },
  {
    text: "Cerrar sesión",
    icono: <v.iconoCerrarSesion />,
    tipo: "cerrarsesion",
  },
];

// === SIDEBAR PRINCIPAL ===
export const LinksArray = [
  {
    label: "Home",
    icon: "noto-v1:house",
    to: "/",
    permiso: 1,
  },
  {
    label: "Productos",
    icon: "mdi:shopping-outline",
    to: "/configuracion/productos",
    permiso: 2,
  },
  {
    label: "Inventario",
    icon: "flat-ui:box",
    to: "/inventario",
    permiso: 3,
  },
  {
    label: "VENDER",
    icon: "fluent-emoji-flat:shopping-cart",
    to: "/pos",
    permiso: 4,
  },
];

// === MENÚ SECUNDARIO (CONFIGURACIÓN / OTROS) ===
export const SecondarylinksArray = [

  {
    label: "Configuración",
    icon: "icon-park:setting-two",
    to: "/configuracion",
    color: "#CE82FF",
    permiso: 15, // ✅ módulo real de Configuración
  },
  {
    label: "Mi perfil",
    icon: "icon-park:avatar",
    to: "/miperfil",
    color: "#CE82FF",
    permiso: 7,
  },
];

// === TEMAS ===
export const TemasData = [
  {
    icono: "🌞",
    descripcion: "light",
  },
  {
    icono: "🌚",
    descripcion: "dark",
  },
];

// === CONFIGURACIÓN (Tarjetas del Menú) ===
export const DataModulosConfiguracion = [
  {
    title: "Productos",
    subtitle: "Registra tus productos",
    icono: "https://i.ibb.co/85zJ6yG/caja-del-paquete.png",
    link: "/configurar/productos",
  },
  {
    title: "Personal",
    subtitle: "Ten el control de tu personal",
    icono: "https://i.ibb.co/5vgZ0fX/hombre.png",
    link: "/configurar/usuarios",
  },
  {
    title: "Tu empresa",
    subtitle: "Configura tus opciones básicas",
    icono: "https://i.ibb.co/x7mHPgm/administracion-de-empresas.png",
    link: "/configurar/empresa",
  },
  {
    title: "Categoría de productos",
    subtitle: "Asigna categorías a tus productos",
    icono: "https://i.ibb.co/VYbMRLZ/categoria.png",
    link: "/configurar/categorias",
  },
  {
    title: "Marca de productos",
    subtitle: "Gestiona tus marcas",
    icono: "https://i.ibb.co/1qsbCRb/piensa-fuera-de-la-caja.png",
    link: "/configurar/marca",
  },
];

// === TIPOS DE USUARIO ===
export const TipouserData = [
  {
    descripcion: "Cajero",
    icono: "🪖",
  },
  {
    descripcion: "Admin",
    icono: "👑",
  },
];

// === TIPOS DE DOCUMENTO ===
export const TipoDocData = [
  {
    descripcion: "DNI",
    icono: "🪖",
  },
  {
    descripcion: "Libreta electoral",
    icono: "📘",
  },
  {
    descripcion: "Otros",
    icono: "📄",
  },
];
