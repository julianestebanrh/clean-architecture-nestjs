<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


# Nest.js Clean Architecture with Docker and PostgreSQL

Este es un proyecto de ejemplo que implementa una aplicación Nest.js utilizando **Clean Architecture**, **Docker**, **PostgreSQL** y **TypeORM** con migraciones. El proyecto está diseñado para ser escalable, mantenible y fácil de configurar.

---

## **Estructura del Proyecto**

El proyecto sigue una estructura de **Clean Architecture** con las siguientes capas:






Además, el proyecto incluye:

- **Dockerfile**: Para construir y ejecutar la aplicación en un contenedor.
- **docker-compose.yml**: Para levantar la aplicación junto con una base de datos PostgreSQL.
- **Migrations**: Para gestionar cambios en la base de datos.

---

## **Requisitos Previos**

Antes de comenzar, asegúrate de tener instalado:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/) (opcional, para desarrollo local)

---

## **Configuración del Entorno**

1. **Variables de Entorno**:

   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

   ```env
    # Configuración de la base de datos
    DB_HOST=db
    DB_PORT=5432
    DB_USERNAME=myuser
    DB_PASSWORD=mypassword
    DB_DATABASE=mydatabase

    # Configuración de la aplicación
    NODE_ENV=development
    PORT=3000
   ```

Nota: Estas variables son utilizadas tanto en la aplicación como en el archivo docker-compose.yml.

2. **Instalación de Dependencias**:

    Si estás desarrollando localmente, instala las dependencias con tu administrador de paquetes preferido:

    ```bash
    npm install
    # o
    yarn install
    # o
    pnpm install
    ```

---

**Ejecutar Migraciones**
------------------------

Las migraciones se ejecutan automáticamente al iniciar la aplicación en Docker. Sin embargo, si deseas ejecutarlas manualmente, sigue estos pasos:

1.  **Ejecutar Migraciones Localmente:**
    
    Asegúrate de que la base de datos esté en funcionamiento y ejecuta:
    ```bash
    npx typeorm migration:run
    ```
2.  **Revertir Migraciones:** 
    
    Si necesitas revertir la última migración, usa:
    ```bash
    npx typeorm migration:revert
    ```
3.  **Generar Nueva Migración:** 

    Si realizas cambios en las entidades, genera una nueva migración:
    ```bash
    npx typeorm migration:generate -d ormconfig.js ./src/infrastructure/persistence/migrations/initial-migration
    ```

---

**Ejecutar con Docker**
-----------------------

El proyecto está configurado para ejecutarse en contenedores Docker utilizando docker-compose.

1. **Construir y Levantar los Contenedores:** 
    
    Ejecuta el siguiente comando en la raíz del proyecto:
    ```bash
    docker-compose up --build
    ```
    Esto construirá la imagen de la aplicación y levantará los servicios app (Nest.js) y db (PostgreSQL).

2. **Detener los Contenedores**: 

    Para detener los servicios, usa:
    ```bash
    docker-compose down
    ```
    Si también deseas eliminar el volumen de PostgreSQL, usa:
    ```bash
    docker-compose down --volumes
    ```

3. **Ver los Logs:**

    Para ver los logs de la aplicación o la base de datos, usa:
    ```bash
    docker-compose logs -f app  # Logs de la aplicación
    docker-compose logs -f db   # Logs de la base de datos
    ```

4. **Acceder a la Aplicación:**
  
    Una vez que los servicios estén en funcionamiento, puedes acceder a la aplicación en:
    ```bash
    http://localhost:3000
    ```

5. **Acceder a la Base de Datos:**

    Puedes conectarte a la base de datos PostgreSQL usando cualquier cliente (como psql o pgAdmin) en: 
    ```bash
      Host: db
      Port: 5432
      Username: postgres
      Password: postgres
      Database: clean_architecture
    ```

**Desarrollo Local**
--------------------

Si prefieres desarrollar localmente sin Docker, sigue estos pasos:

1. **Instalar Dependencias:**

    ```bash
    npm install
    # o
    yarn install
    # o
    pnpm install
    ```

2. **Configurar la Base de Datos:**

    Asegúrate de tener PostgreSQL instalado y configurado con las credenciales especificadas en el archivo .env.

3. **Ejecutar la Aplicación:**

    ```bash
    npm run start:dev
    # o
    yarn start:dev
    # o
    pnpm start:dev
    ```

4. **Ejecutar Migraciones:**

    ```bash
    npx typeorm migration:run
    ```

---

**Generación de IDs**
---------------------

El proyecto utiliza un servicio centralizado para generar IDs únicos. Actualmente, está configurado para usar **UUID**, pero puedes cambiarlo fácilmente a **NanoID**, **CUID**, u otro generador de IDs.

*   **Servicio de Generación de IDs**: `src/domain/services/id-generator.service.ts`
    
*   **Cambiar el Generador**: Modifica el método `generateId()` en el servicio.

---



<!--  npx typeorm migration:generate -d ormconfig.js src/infrastructure/persistence/migrations/initial-migration -->


<!-- listo teniendo en cuenta  toda mi arquitectura que hemos creado si quiero usar el patron Result para manejar mis respuestas y errores como lo puedo hacer -->


<!-- pnpm test test/architecture.spec.ts -->