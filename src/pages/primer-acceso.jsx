import { useForm } from "react-hook-form";
import { supabase } from "../supabaseClient"; // tu cliente ya configurado
import { toast } from "sonner";

export default function PrimerAcceso() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      // 1️⃣ Cambiar contraseña en Auth
      const { error: authError } = await supabase.auth.updateUser({
        password: data.newPassword,
      });
      if (authError) throw authError;

      // 2️⃣ Actualizar datos en tabla usuarios
      const user = (await supabase.auth.getUser()).data.user;
      const { error: dbError } = await supabase
        .from("usuarios")
        .update({
          nombres: data.nombres,
          telefono: data.telefono,
          nro_doc: data.nro_doc,
          must_change_password: false,
        })
        .eq("correo", user.email);

      if (dbError) throw dbError;

      toast.success("Datos actualizados correctamente 🎉");
      window.location.href = "/dashboard"; // o el panel que corresponda
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Actualizar tus datos</h2>
      <p>Por seguridad, actualiza tu información antes de continuar.</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Nombre completo"
          {...register("nombres", { required: true })}
        />
        {errors.nombres && <p>Campo requerido</p>}

        <input
          type="text"
          placeholder="DPI (13 dígitos)"
          {...register("nro_doc", { required: true, pattern: /^\d{13}$/ })}
        />
        {errors.nro_doc && <p>DPI inválido</p>}

        <input
          type="text"
          placeholder="Teléfono (8 dígitos)"
          {...register("telefono", { required: true, pattern: /^\d{8}$/ })}
        />
        {errors.telefono && <p>Teléfono inválido</p>}

        <input
          type="password"
          placeholder="Nueva contraseña"
          {...register("newPassword", {
            required: true,
            pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/,
          })}
        />
        {errors.newPassword && <p>Contraseña insegura</p>}

        <button type="submit">Guardar cambios</button>
      </form>
    </div>
  );
}
