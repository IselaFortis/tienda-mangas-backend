-- Para una base que YA existe (Aiven): agrega la columna de portadas y las de los 3 mangas de ejemplo.
-- Ejecutar con Alt + X en DBeaver, con la base tienda_mangas seleccionada.
USE tienda_mangas;
ALTER TABLE mangas ADD COLUMN imagen VARCHAR(500) NULL;
UPDATE mangas SET imagen='https://covers.openlibrary.org/b/isbn/9781569319017-L.jpg?default=false' WHERE titulo LIKE 'One Piece%';
UPDATE mangas SET imagen='https://covers.openlibrary.org/b/isbn/9781593070205-L.jpg?default=false' WHERE titulo LIKE 'Berserk%';
UPDATE mangas SET imagen='https://covers.openlibrary.org/b/isbn/9781974709939-L.jpg?default=false' WHERE titulo LIKE 'Chainsaw Man%';
