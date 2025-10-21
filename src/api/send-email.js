// src/api/send-email.js
export async function sendUserEmail({ email, nombre = '', password = 'patito123' }) {
  try {
    const response = await fetch('https://csjldpyuyxlxxkogfalj.supabase.co/functions/v1/smart-responder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
