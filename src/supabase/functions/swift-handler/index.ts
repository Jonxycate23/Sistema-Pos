import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const { email, dpi } = await req.json();
    if (!email || !dpi) throw new Error("Faltan datos requeridos");

    const { data: user, error: userError } = await supabaseAdmin
      .from("usuarios")
      .select("correo, nro_doc, nombres")
      .eq("correo", email)
      .single();

    if (userError || !user) throw new Error("Usuario no encontrado");
    if (user.nro_doc !== dpi) throw new Error("El DPI no coincide");

    const { data: usersList, error: authError } =
      await supabaseAdmin.auth.admin.listUsers();
    if (authError) throw authError;

    const matched = usersList.users.find((u) => u.email === email);
    if (!matched) throw new Error("Usuario no registrado en Auth");

    const token = crypto.randomUUID();
    const expiracion = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    await supabaseAdmin.from("reset_tokens").insert([
      { correo: email, token, expiracion, uid: matched.id },
    ]);

    const url = `https://cosecha-verde.com/restablecer/${token}`;
    const mailResponse = await fetch(
      "https://csjldpyuyxlxxkogfalj.supabase.co/functions/v1/smart-responder",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          nombre: user.nombres || email.split("@")[0],
          url,
          type: "password_reset",
        }),
      }
    );

    if (!mailResponse.ok) throw new Error("Error al enviar el correo");

    return new Response(
      JSON.stringify({ success: true, message: "Correo enviado" }),
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("❌ Error:", err.message);
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  }
});
