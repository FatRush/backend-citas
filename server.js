const express = require('express');
const cors = express ? require('cors') : null;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor de MediSync corriendo sin correos 🚀');
});

app.post('/api/enviar-correo', async (req, res) => {
  console.log('📥 Cita procesada en el servidor (Modo sin correo):', req.body);
  
  // Aquí puedes registrar el evento o simplemente confirmar la petición
  res.status(200).json({ 
    success: true, 
    message: 'Cita actualizada y procesada correctamente en el servidor' 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor iniciado en el puerto ${PORT}`));
});
