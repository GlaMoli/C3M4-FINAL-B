# 🎬 Nodo Cine - Backend API (Fullstack Project)

Este es el servidor central de la plataforma **Nodo Cine**, una aplicación tipo "mini Netflix" desarrollada para cumplir con estándares de alta calidad, seguridad y escalabilidad. Gestiona la lógica de negocio, la autenticación y la persistencia de datos.

---

## 🎯 Objetivos del Proyecto Cumplidos
Este backend ha sido diseñado siguiendo una estructura de **Fullstack (React + Node)**, cubriendo los siguientes requisitos:
- **CRUD Completo:** Gestión de Usuarios, Perfiles y Favoritos (Películas).
- **Seguridad:** Autenticación robusta mediante JSON Web Tokens (JWT).
- **Roles:** Diferenciación de capacidades entre Dueño de cuenta, Perfil Estándar y Perfil Niño (Filtro de contenido).
- **Integración:** Consumo de la API externa de **TMDB** para datos en tiempo real.

---

## 🛠️ Tecnologías y Librerías
* **Node.js & Express:** Motor y framework principal.
* **MongoDB & Mongoose:** Base de datos NoSQL y modelado de datos.
* **JWT (JsonWebToken):** Protección de rutas y manejo de sesiones.
* **Helmet:** Seguridad en cabeceras HTTP.
* **CORS:** Gestión de acceso desde el Frontend (Vite).
* **Dotenv:** Administración de variables de entorno para un despliegue seguro.

---

## 🧱 Arquitectura de Datos (Mongoose)
El sistema se basa en tres entidades principales interconectadas:
1.  **Usuarios (Users):** Almacena credenciales (hasheadas) y datos de la cuenta.
2.  **Perfiles (Profiles):** Permite múltiples perfiles por usuario, cada uno con su nombre, avatar y **restricción de edad**.
3.  **Favoritos/Watchlist:** Colección vinculada a cada perfil para guardar películas seleccionadas.



---

## 🔐 Endpoints Seguros

### Autenticación e Inicio
- `POST /api/users` - Registro de nuevos usuarios.
- `POST /api/users/login` - Generación de token JWT.

### Gestión de Perfiles (Protegido por JWT)
- `GET /api/profiles` - Obtiene los perfiles asociados al usuario logueado.
- `POST /api/profiles` - Crea un nuevo perfil (Adulto/Niño).

### Catálogo y API Externa
- `GET /api/movies` - Conexión con TMDB para traer el catálogo general.
- `GET /api/movies/catalogo/:pId` - Filtra el contenido según la edad del perfil seleccionado.
- `POST /api/contacto` - Registro de mensajes del formulario de contacto.

---

## ⚙️ Configuración del Entorno
Para replicar este servidor, es necesario un archivo `.env` en la raíz con las siguientes claves:
```env
PORT=3000
MONGO_URI=mongodb+srv://...
JWT_SECRET=tu_secreto_super_seguro
VITE_TMDB_API_KEY=tu_api_key_de_tmdb


🛠️ Instalación y Setup Local
Clonar el repositorio: git clone <url-de-tu-repositorio-backend>
cd <nombre-de-tu-carpeta-backend>

Instalar dependencias: npm install

Configurar el entorno: Crear el archivo .env basado en la sección anterior.

Lanzar el servidor: node app.mjs 