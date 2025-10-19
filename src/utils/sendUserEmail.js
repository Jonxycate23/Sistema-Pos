import { Resend } from 'resend'

// 👇 Puedes guardar esta clave en un .env si prefieres
const resend = new Resend('re_U5Nx7QJX_9ZAte6zQo6ZLvY93k7YJ1cN5')

export async function sendUserEmail({ email, nombre = '', password = 'patito123' }) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Cosecha Verde <no-reply@cosechaverde.com>',
      to: email,
      subject: 'Tu cuenta en Cosecha Verde ha sido creada',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7f7f7;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px;">
            <img src="https://i.imgur.com/NWZyYfA.png" alt="Logo" style="width: 120px; margin-bottom: 20px;" />

            <h2 style="color: #2e7d32;">Bienvenido a Cosecha Verde 🌱</h2>
            <p>Hola ${nombre || 'usuario'}, tu cuenta ha sido creada exitosamente por el administrador.</p>

            <p><strong>Correo:</strong> ${email}</p>
            <p><strong>Contraseña temporal:</strong> ${password}</p>

            <p style="color: #555;">Por tu seguridad, te pedimos cambiar esta contraseña en tu primer inicio de sesión.</p>

            <a href="http://localhost:5173/login" style="display: inline-block; margin-top: 20px; background-color: #2e7d32; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ir al sistema</a>
          </div>
        </div>
      `
    })

    if (error) {
      console.error('Error al enviar correo:', error)
      return { success: false, error }
    }

    return { success: true }
  } catch (err) {
    console.error('Excepción al enviar correo:', err)
    return { success: false, error: err }
  }
}
