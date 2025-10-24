// src/pages/RestablecerPassword.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import styled from "styled-components";

export default function RestablecerPassword() {
  const { token } = useParams();
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (form) => {
    if (!token) return toast.error("Enlace inválido o faltante");
    setLoading(true);
    try {
      const response = await fetch(
        "https://csjldpyuyxlxxkogfalj.supabase.co/functions/v1/smooth-action",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            newPassword: form.newPassword,
          }),
        }
      );

      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      toast.success("✅ Contraseña actualizada correctamente");
      setTimeout(() => (window.location.href = "/login"), 2000);
    } catch (err) {
      toast.error(err.message || "Error al restablecer la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Toaster position="top-center" />
      <Title>Restablecer Contraseña</Title>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Label>Nueva Contraseña</Label>
        <Input
          {...register("newPassword", { required: true })}
          type="password"
          placeholder="Ingresa tu nueva contraseña"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Actualizando..." : "Actualizar Contraseña"}
        </Button>
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
