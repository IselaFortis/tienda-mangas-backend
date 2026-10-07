-- Local: ejecutar completo. En Aiven: quitar CREATE DATABASE y USE (Guía 13) y usar defaultdb.
CREATE DATABASE IF NOT EXISTS tienda_mangas;
USE tienda_mangas;

CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(60) NOT NULL,
  telefono VARCHAR(20)
);

CREATE TABLE mangas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(80) NOT NULL,
  autor VARCHAR(60),
  precio DECIMAL(6,2) NOT NULL
);

CREATE TABLE ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  manga_id INT NOT NULL,
  cantidad INT NOT NULL,
  fecha DATE,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  FOREIGN KEY (manga_id) REFERENCES mangas(id)
);

INSERT INTO clientes (nombre, telefono) VALUES ('Carlos Mejía','7777-1234'), ('Lucía Ramos','7888-5678');
INSERT INTO mangas (titulo, autor, precio) VALUES
  ('One Piece Vol. 1','Eiichiro Oda',9.99),
  ('Berserk Vol. 1','Kentaro Miura',14.50),
  ('Chainsaw Man Vol. 1','Tatsuki Fujimoto',9.99);
INSERT INTO ventas (cliente_id, manga_id, cantidad, fecha) VALUES (1,1,2,'2026-10-01'), (2,2,1,'2026-10-02');
