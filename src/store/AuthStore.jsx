import { create } from "zustand";
import { supabase } from "../index";

export const useAuthStore = create((set) => ({
  user: null, // datos del usuario autenticado
  rol: null,  // rol del usuario: "admin", "cajero", etc.

  // 🔹 Iniciar sesión con Google
  loginGoogle: async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  },

  // 🔹 Cerrar sesión
  cerrarSesion: async () => {
    await supabase.auth.signOut();
    set({ user: null, rol: null });
  },

  // 🔹 Iniciar sesión con email y contraseña
  loginEmail: async (p) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: p.email,
      password: p.password,
    });

    if (error) {
      if (error.status === 400) {
        throw new Error("Correo o contraseña incorrectos");
      } else {
        throw new Error("Error al iniciar sesión: " + error.message);
      }
    }

    set({ user: data.user });

    // Obtiene el rol del usuario desde la BD
    const rol = await obtenerRolUsuario(data.user.id);
    set({ rol });

    return data.user;
  },

  // 🔹 Crear cuenta nueva y loguear
  crearUserYLogin: async (p) => {
    const { data, error } = await supabase.auth.signUp({
      email: p.email,
      password: p.password,
    });

    if (error) throw new Error(error.message);
    return data.user;
  },
}));

// 🔸 Función auxiliar para obtener el rol desde la tabla "usuarios"
async function obtenerRolUsuario(idAuth) {
  const { data, error } = await supabase
    .from("usuarios")
    .select("roles(nombre)")
    .eq("id_auth", idAuth)
    .single();

  if (error) {
    console.error("Error obteniendo rol:", error.message);
    return null;
  }

  return data?.roles?.nombre || null;
}
