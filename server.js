const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'brayanyglenda@gmail.com',
    pass: process.env.EMAIL_PASS || 'uiry qjwt znor dbqy' // Usa variable de entorno o tu contraseña
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error en la conexión con el servidor SMTP:', error.message);
  } else {
    console.log('✅ Servidor de correo listo para enviar mensajes.');
  }
});

app.get('/', (req, res) => {
  res.send('Servidor de MediSync con Nodemailer corriendo 🚀');
});

app.post('/api/enviar-correo', async (req, res) => {
  console.log('📥 Petición recibida en /api/enviar-correo:', req.body);

  const { email, cita } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'El correo del paciente es requerido.' });
  }

  const pacienteNombre = cita?.paciente || 'Paciente';
  const apellidoPaciente = cita?.apellidoPaciente || '';
  const pacienteCompleto = `${pacienteNombre} ${apellidoPaciente}`.trim();
  
  const doctorNombre = cita?.doctor || 'Doctor';
  const fechaCita = cita?.fecha || 'Fecha no especificada';
  const horaCita = cita?.hora || 'Hora no especificada';

  const mailOptions = {
    from: '"MediSync te Saluda" <brayanyglenda@gmail.com>',
    to: email,
    subject: 'Confirmación de Cita Médica',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #2b579a;">¡Hola, ${pacienteCompleto}!</h2>
        <p>Tu cita médica ha sido <strong>CONFIRMADA</strong> con éxito.</p>
        <hr />
        <h3>Detalles de la cita:</h3>
        <ul>
          <li><strong>Doctor:</strong> ${doctorNombre}</li>
          <li><strong>Fecha:</strong> ${fechaCita}</li>
          <li><strong>Hora:</strong> ${horaCita}</li>
        </ul>
        <br />
        <p>Por favor, preséntate 10 minutos antes de la hora acordada.</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Correo enviado con éxito. ID:', info.messageId);
    return res.status(200).json({ success: true, message: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('❌ Error al enviar el correo con Nodemailer:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Error interno al enviar el correo' 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
