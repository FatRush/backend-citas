const express = require('express');
const cors = express ? require('cors') : null;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor de MediSync con Resend corriendo 🚀');
});

app.post('/api/enviar-correo', async (req, res) => {
  console.log('📥 Petición de cita recibida:', req.body);
  const { email, cita } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Falta el correo del paciente' });
  }

  const pacienteNombre = cita?.paciente || 'Paciente';
  const apellidoPaciente = cita?.apellidoPaciente || '';
  const pacienteCompleto = `${pacienteNombre} ${apellidoPaciente}`.trim();

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'MediSync <onboarding@resend.dev>', // Puedes usar este dominio de prueba inicial
        to: [email],
        subject: 'Confirmación de Cita Médica - MediSync',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #2b579a;">¡Hola, ${pacienteCompleto}!</h2>
            <p>Tu cita médica ha sido <strong>CONFIRMADA</strong> con éxito.</p>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <h3>Detalles de la cita:</h3>
            <ul>
              <li><strong>Doctor(a):</strong> ${cita?.doctor || 'No especificado'}</li>
              <li><strong>Fecha:</strong> ${cita?.fecha || 'No especificada'}</li>
              <li><strong>Hora:</strong> ${cita?.hora || 'No especificada'}</li>
            </ul>
            <p style="margin-top: 20px; font-size: 14px; color: #666;">Por favor, preséntate unos minutos antes. ¡Gracias por confiar en nosotros!</p>
          </div>
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al enviar el correo a través de Resend');
    }

    console.log('✅ Correo enviado con éxito mediante Resend. ID:', data.id);
    return res.status(200).json({ success: true, message: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
