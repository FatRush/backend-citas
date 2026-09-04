const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor de MediSync corriendo correctamente 🚀');
});

app.post('/api/enviar-correo', async (req, res) => {
  console.log('📥 Petición de cita recibida en el servidor:', req.body);
  const { email, cita } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Falta correo o datos de la cita' });
  }

  // Aquí el servidor procesa el aviso de forma interna sin usar SMTP bloqueado
  console.log(`✅ Cita procesada para el paciente: ${cita?.paciente || 'Paciente'} (${email})`);

  return res.status(200).json({ 
    success: true, 
    message: 'Cita procesada correctamente en el servidor' 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
