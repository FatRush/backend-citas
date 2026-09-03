const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor de MediSync con Brevo API corriendo 🚀');
});

app.post('/api/enviar-correo', async (req, res) => {
  console.log('📩 Petición recibida:', req.body);
  const { email, cita } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Falta correo' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { 
          name: "MediSync", 
          email: process.env.BREVO_SENDER_EMAIL 
        },
        to: [{ email: email }],
        subject: "Confirmación de Cita Médica",
        htmlContent: `
          <h2>¡Hola ${cita?.paciente || 'Paciente'}!</h2>
          <p>Tu cita médica ha sido <strong>CONFIRMADA</strong>.</p>
          <ul>
            <li><strong>Doctor:</strong> ${cita?.doctor || 'No especificado'}</li>
            <li><strong>Fecha:</strong> ${cita?.fecha || 'No especificada'}</li>
            <li><strong>Hora:</strong> ${cita?.hora || 'No especificada'}</li>
          </ul>
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al enviar correo mediante Brevo');
    }

    console.log('✅ Correo enviado con éxito por Brevo. ID:', data.messageId);
    res.status(200).json({ success: true, message: 'Correo enviado' });
  } catch (error) {
    console.error('❌ Error de Brevo al enviar correo:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor iniciado en el puerto ${PORT}`));
