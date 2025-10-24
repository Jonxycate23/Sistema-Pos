// src/pages/RecuperarAcceso.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import styled from "styled-components";

export default function RecuperarAcceso() {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  // 🚀 Nuevo onSubmit — llama directamente al Edge Function swift-handler
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://csjldpyuyxlxxkogfalj.supabase.co/functions/v1/swift-handler",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            dpi: data.dpi,
          }),
        }
      );

      const result = await response.json();
      if (!result.success) throw new Error(result.message);

      toast.success("Se envió un enlace de recuperación al correo 📩");
      reset();
    } catch (err) {
      toast.error(err.message || "Ocurrió un error al enviar el correo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Toaster position="top-center" />
      <Title>Recuperar Acceso</Title>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Label>Correo Electrónico</Label>
        <Input {...register("email", { required: true })} type="email" />
        <Label>DPI</Label>
        <Input {...register("dpi", { required: true })} type="text" />
        <Button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar enlace de recuperación"}
        </Button>
      </form>
    </Container>
  );
}

// ==== ESTILOS ====
const Container = styled.div`
  max-width: 400px;
  margin: 100px auto;
  background: #1a1a1a;
  padding: 30px;
  border-radius: 12px;
  color: white;
`;
const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;
const Label = styled.label`
  display: block;
  margin-top: 10px;
`;
const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: none;
  margin-top: 5px;
  background: #2b2b2b;
  color: white;
`;
const Button = styled.button`
  width: 100%;
  margin-top: 20px;
  padding: 10px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background: #7c3aed;
  }
`;
