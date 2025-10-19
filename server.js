const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos desde la carpeta 'cliente'
app.use(express.static(path.join(__dirname, 'cliente')));

// Manejar todas las rutas y devolver index.html (para SPA)
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'cliente', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`🌐 Aplicación disponible en: http://localhost:${PORT}`);
});