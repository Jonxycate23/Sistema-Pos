import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase/supabase.config.jsx";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import styled from "styled-components";

export default function RestablecerPassword() {
  const { token } = useParams();
  const { register, handleSubmit } = useForm();
  const [correo, setCorreo] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 para esperar verificación

  useEffect(() => {
    const verificarToken = async () => {
      if (!token) {
        toast.error("Token no proporcionado ❌");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("reset_tokens")
        .select("*")
        .eq("token", token)
        .single();

      console.log("🔍 Verificando token:", { data, error });

      if (error || !data) {
        toast.error("Enlace inválido o expirado");
        setLoading(false);
        return;
      }

      if (new Date(data.expiracion) < new Date()) {
        toast.error("El enlace ha expirado");
        setLoading(false);
        return;
      }

      setCorreo(data.correo);
      setLoading(false);
    };

    verificarToken();
  }, [token]);

  const onSubmit = async (form) => {
    if (!correo) return toast.error("Token inválido o no asociado");
    const { error } = await supabase.auth.updateUser({
      email: correo,
      password: form.newPassword,
    });
    if (error) return toast.error(error.message);

    toast.success("Contraseña restablecida correctamente 🎉");
    setTimeout(() => (window.location.href = "/login"), 2000);
  };

  if (loading) {
    return (
      <Container>
        <Toaster position="top-center" />
        <Title>Verificando enlace...</Title>
      </Container>
    );
  }

  if (!correo) {
    return (
      <Container>
        <Toaster position="top-center" />
        <Title>Enlace inválido o expirado ❌</Title>
        <Button onClick={() => (window.location.href = "/recuperar-acceso")}>
          Volver a Recuperar Acceso
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Toaster position="top-center" />
      <Title>Restablecer Contraseña</Title>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Label>Nueva Contraseña</Label>
        <Input {...register("newPassword", { required: true })} type="password" />
        <Button type="submit">Actualizar Contraseña</Button>
      </form>
    </Container>
  );
}

// === Estilos ===
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const Title = styled.h2`
  color: #2e7d32;
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #333;
`;

const Input = styled.input`
  padding: 10px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: #2e7d32;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background-color: #256628;
  }
`;
