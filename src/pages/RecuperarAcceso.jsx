// src/pages/RecuperarAcceso.jsx
import React, { useState } from "react";
import { supabase } from "../supabase/supabase.config.jsx";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import styled from "styled-components";

export default function RecuperarAcceso() {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // 1️⃣ Verificamos el usuario en la tabla
        const { data: user, error } = await supabase
        .from("usuarios")
        .select("correo, nro_doc, nombres")
        .eq("correo", data.email)
        .single();

      if (error || !user) throw new Error("Usuario no encontrado.");
      if (user.nro_doc !== data.dpi) throw new Error("El DPI no coincide.");

      // 2️⃣ Generar token único (válido 10 minutos)
      const token = crypto.randomUUID();
      const expiracion = new Date(Date.now() + 1000 * 60 * 10).toISOString();

      const { error: insertError } = await supabase
        .from("reset_tokens")
        .insert([{ correo: data.email, token, expiracion }]);

      if (insertError) throw insertError;

      // 3️⃣ Crear URL de restablecimiento en tu dominio
      const url = `https://cosecha-verde.com/restablecer/${token}`;

      // 4️⃣ Llamar al edge function de Supabase (tu “smart-responder”)
      const response = await fetch(
        "https://csjldpyuyxlxxkogfalj.supabase.co/functions/v1/smart-responder",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.correo,
            nombre: user.nombre || data.email.split("@")[0],
            url,
            type: "password_reset", // <-- opcional, por si en el backend lo manejas distinto
          }),
        }
      );

      if (!response.ok) throw new Error("Error al enviar el correo.");

      toast.success("Se envió un enlace de recuperación al correo 📩");
      reset();
    } catch (err) {
      toast.error(err.message);
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
const Title = styled.h2`text-align:center;margin-bottom:20px;`;
const Label = styled.label`display:block;margin-top:10px;`;
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
