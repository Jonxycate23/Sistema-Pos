// api/send-email.js
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método no permitido' })
  }

  const { email, nombre = '', password = 'patito123' } = req.body

  try {
    const { error } = await resend.emails.send({
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
            <a href="https://sistema-pos-liart.vercel.app/login" style="display: inline-block; margin-top: 20px; background-color: #2e7d32; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ir al sistema</a>
          </div>
        </div>
      `
    })

    if (error) {
      console.error('Error al enviar correo:', error)
      return res.status(500).json({ success: false, error })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Excepción al enviar correo:', err)
    return res.status(500).json({ success: false, error: err.message })
  }
}
