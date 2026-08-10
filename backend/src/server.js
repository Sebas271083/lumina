require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 8081;

async function start() {
  console.log(`Conectando a MySQL en ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME} (user: ${process.env.DB_USER})...`);
  try {
    await sequelize.authenticate();
    console.log('Conexion a MySQL establecida correctamente.');

    await sequelize.sync();
    console.log('Modelos sincronizados con la base de datos.');

    app.listen(PORT, () => {
      console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('No se pudo iniciar el servidor:', err);
    process.exit(1);
  }
}

start();
