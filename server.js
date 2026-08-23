// const express = require('express');
// const nodemailer = require('nodemailer');
// const cors = require('cors');

// const app = express();

// app.use(cors());
// app.use(express.json());


// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true,
//   auth: {
//     user: 'brayanyglenda@gmail.com', // Tu correo emisor
//     pass: 'vjxx qoqx vdqz ruvc'   // Contraseña de aplicación
//   },
//   tls: {
//     rejectUnauthorized: false // 👈 AGREGA ESTA LÍNEA
//   }
// });


// transporter.verify((error, success) => {
//   if (error) {
//     console.error('❌ Error en la conexión con el servidor SMTP:', error.message);
//   } else {
//     console.log('✅ Servidor de correo listo para enviar mensajes.');
//   }
// });

// app.post('/api/enviar-correo', async (req, res) => {
//   console.log('📥 Petición recibida en /api/enviar-correo:', req.body);

//   const { email, cita } = req.body;

//   if (!email) {
//     return res.status(400).json({ success: false, error: 'El correo del paciente es requerido.' });
//   }

 
//   const pacienteNombre = cita?.paciente || 'Paciente';
//   const doctorNombre = cita?.doctor || 'Doctor';
//   const fechaCita = cita?.fecha || 'Fecha no especificada';
//   const horaCita = cita?.hora || 'Hora no especificada';

//   const mailOptions = {
//     from: '"Clínica Médica" <TU_CORREO@gmail.com>',
//     to: email,
//     subject: 'Confirmación de Cita Médica',
//     html: `
//       <div style="font-family: Arial, sans-serif; padding: 20px;">
//         <h2 style="color: #2b579a;">¡Hola, ${pacienteNombre}!</h2>
//         <p>Tu cita médica ha sido <strong>CONFIRMADA</strong> con éxito.</p>
//         <hr />
//         <h3>Detalles de la cita:</h3>
//         <ul>
//           <li><strong>Doctor:</strong> ${doctorNombre}</li>
//           <li><strong>Fecha:</strong> ${fechaCita}</li>
//           <li><strong>Hora:</strong> ${horaCita}</li>
//         </ul>
//         <br />
//         <p>Por favor, preséntate 10 minutos antes de la hora acordada.</p>
//       </div>
//     `
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log('✅ Correo enviado con éxito. ID:', info.messageId);
//     return res.status(200).json({ success: true, message: 'Correo enviado correctamente' });
//   } catch (error) {
//     console.error('❌ Error al enviar el correo con Nodemailer:', error);
//     return res.status(500).json({ 
//       success: false, 
//       error: error.message || 'Error interno al enviar el correo' 
//     });
//   }
// });

// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
// });


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
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  },
  tls: { rejectUnauthorized: false }
});

app.post('/api/enviar-correo', async (req, res) => {
  const { email, cita } = req.body;
  if (!email) return res.status(400).json({ error: 'Falta correo' });

  try {
    await transporter.sendMail({
      from: `"Clínica Médica" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Confirmación de Cita Médica',
      html: `
        <h2>¡Hola ${cita?.paciente || 'Paciente'}!</h2>
        <p>Tu cita médica ha sido <strong>CONFIRMADA</strong>.</p>
        <ul>
          <li><strong>Doctor:</strong> ${cita?.doctor}</li>
          <li><strong>Fecha:</strong> ${cita?.fecha}</li>
          <li><strong>Hora:</strong> ${cita?.hora}</li>
        </ul>
      `
    });
    res.status(200).json({ success: true, message: 'Correo enviado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Railway asigna automáticamente la variable process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));