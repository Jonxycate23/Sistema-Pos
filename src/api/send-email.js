// src/api/send-email.js

export async function sendUserEmail({ email, nombre = '', password = 'patito123' }) {
  try {
    const response = await fetch('https://csjldpyuyxlxxkogfalj.supabase.co/functions/v1/smart-responder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzamxkcHl1eXhseHhrb2dmYWxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MDQ1NzksImV4cCI6MjA3MjE4MDU3OX0.djOUOJbEkXRJDvH6paq1aWZnlfXECQuoI8L7nBXk93g',
      },
      body: JSON.stringify({
        email,
        nombre,
        password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Error al enviar correo:', result);
      return { success: false, error: result };
    }

    return { success: true };
  } catch (err) {
    console.error('❌ Excepción al enviar correo:', err);
    return { success: false, error: err.message };
  }
}
