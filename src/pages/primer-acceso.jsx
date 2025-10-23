import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { InputText2 } from "../components/organismos/formularios/InputText2";
import { Btn1 } from "../components/moleculas/Btn1";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { supabase } from "../supabase/supabase.config.jsx";
import { slideBackground } from "../styles/keyframes";

export default function PrimerAcceso() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  // Obtener usuario autenticado y sus datos
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("No se encontró usuario. Vuelve a iniciar sesión.");
        window.location.href = "/login";
        return;
      }

      // Buscar información del usuario en la tabla "usuarios"
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("correo", user.email)
        .single();

      if (error) {
        toast.error("Error al obtener los datos del usuario.");
      } else {
        setUserData(data);
      }
    };
    fetchUser();
  }, []);

  const onSubmit = async (data) => {
    if (!userData?.correo) return;

    setLoading(true);
    try {
      // Actualizar contraseña
      const { error: authError } = await supabase.auth.updateUser({
        password: data.newPassword,
      });
      if (authError) throw authError;

      // Marcar que ya cambió su contraseña
      const { error: dbError } = await supabase
        .from("usuarios")
        .update({ must_change_password: false })
        .eq("correo", userData.correo);

      if (dbError) throw dbError;

      toast.success("Contraseña actualizada correctamente 🎉");

      // Redirección según el rol
      if (userData?.rol === "superadmin") window.location.href = "/panel-admin";
      else if (userData?.rol === "empleado") window.location.href = "/panel-cajero";
      else window.location.href = "/dashboard";

    } catch (err) {
      toast.error("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Toaster position="top-right" />
      <Title>Primer Ingreso</Title>

      <Avatar>
        <ContentRol>
          <span>{userData?.rol || "Usuario"} </span>
        </ContentRol>
        <span className="nombre">Hola {userData?.nombres || "Usuario"}</span>
      </Avatar>

      <Mensaje>
        Por tu seguridad, antes de continuar, debes actualizar tu contraseña.
      </Mensaje>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Label>Ingresa tu Nueva Contraseña</Label>
        <InputText2>
          <input
            className="form__field"
            type="password"
            placeholder="Ejemplo: Ab$d.2025#"
            {...register("newPassword", {
              required: true,
              pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/,
            })}
          />
        </InputText2>

        {errors.newPassword && (
        <ErrorText>
            La contraseña debe incluir al menos 8 dígitos, incluyendo números,
            símbolos y letras.
        </ErrorText>
        )}


        <br />
        <Btn1
          bgcolor="#0930bb"
          color="#fff"
          titulo={loading ? "Actualizando..." : "GUARDAR CAMBIOS"}
        />
      </form>
    </Container>
  );
}

/* ====== ESTILOS ====== */
const ContentRol = styled.div`
  background-color: #391ebb;
  border: 2px solid #fff;
  border-radius: 8px;
  position: absolute;
  top: -10px;
  right: 10px;
  padding: 5px 8px;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
`;

const Container = styled.div`
  padding: 45px;
  border-radius: 10px;
  max-width: 400px;
  margin: 0 auto;
  position: relative;
`;


const Title = styled.h1`
  font-size: 34px;
  margin-bottom: 20px;
  text-align: center;
  color: #ffffff;
  padding: 30px;
`;

const Avatar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  width: 100%;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  .nombre {
    font-weight: 700;
    text-align: center;
    align-self: center;
    font-size: 22px;
    color: #fff !important;
  }
  background-color: #391ebb;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 120 120'%3E%3Cpolygon fill='%23000' fill-opacity='0.19' points='120 0 120 60 90 30 60 0 0 0 0 0 60 60 0 120 60 120 90 90 120 60 120 0'/%3E%3C/svg%3E");
  background-size: 60px 60px;
  animation: ${slideBackground} 10s linear infinite;
`;

const Label = styled.label`
  display: block;
  padding: 22px;
  text-align: center;
  font-size: 20px;
  color: #7bff00;
`;

const Mensaje = styled.p`
  color: #ffffff;
  font-weight: 700;
  margin-bottom: 15px;
  line-height: 1.4;
`;


const ErrorText = styled.p`
  color: #ff0000;
  font-weight: 700;
  margin-top: 5px;
  padding: 1px;
`;
