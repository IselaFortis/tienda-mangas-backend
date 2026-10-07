require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tienda_mangas',
  port: process.env.DB_PORT || 3306,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  dateStrings: true, // DATE llega como 'YYYY-MM-DD' (compatible con <input type="date">)
  waitForConnections: true,
  connectionLimit: 10
});

// Envuelve cada ruta: cualquier error de BD responde 500 en vez de tumbar el servidor
const seguro = fn => async (req, res) => {
  try { await fn(req, res); }
  catch (e) { console.error(e); res.status(500).json({ message: e.sqlMessage || e.message }); }
};

// CRUD genérico: GET, POST, PUT y DELETE para una tabla
function crud(ruta, tabla, campos) {
  app.get(`/${ruta}`, seguro(async (req, res) => {
    const [filas] = await db.query(`SELECT * FROM ${tabla}`);
    res.json(filas);
  }));
  app.post(`/${ruta}`, seguro(async (req, res) => {
    await db.query(
      `INSERT INTO ${tabla} (${campos.join(', ')}) VALUES (${campos.map(() => '?').join(', ')})`,
      campos.map(c => req.body[c]));
    res.json({ message: 'Registro creado correctamente' });
  }));
  app.put(`/${ruta}/:id`, seguro(async (req, res) => {
    await db.query(
      `UPDATE ${tabla} SET ${campos.map(c => `${c}=?`).join(', ')} WHERE id=?`,
      [...campos.map(c => req.body[c]), req.params.id]);
    res.json({ message: `Registro ${req.params.id} actualizado` });
  }));
  app.delete(`/${ruta}/:id`, seguro(async (req, res) => {
    await db.query(`DELETE FROM ${tabla} WHERE id=?`, [req.params.id]);
    res.json({ message: `Registro ${req.params.id} eliminado` });
  }));
}

// GET /ventas con JOIN múltiple (se declara antes para tener prioridad sobre el GET genérico)
app.get('/ventas', seguro(async (req, res) => {
  const [filas] = await db.query(`
    SELECT v.id, v.cliente_id, v.manga_id, c.nombre AS cliente, m.titulo AS manga,
           v.cantidad, m.precio, (v.cantidad * m.precio) AS total, v.fecha
    FROM ventas v
    INNER JOIN clientes c ON v.cliente_id = c.id
    INNER JOIN mangas m ON v.manga_id = m.id
    ORDER BY v.fecha DESC, v.id DESC`);
  res.json(filas);
}));

crud('clientes', 'clientes', ['nombre', 'telefono']);
crud('mangas', 'mangas', ['titulo', 'autor', 'precio']);
crud('ventas', 'ventas', ['cliente_id', 'manga_id', 'cantidad', 'fecha']);

app.listen(PORT, () => console.log(`API Tienda de Mangas en puerto ${PORT}`));
