# Definición de imagen base
FROM node:16.17.1-alpine3.16
# Creación del directorio de trabajo
WORKDIR /app
# Copia de los package.json a la carpeta raiz
COPY package*.json ./
# Ejecución de comando para instalar dependencias
RUN npm install
# Copia de todo el código de la aplicación
COPY . .
# Exponemos un puerto para conectarme desde cualquier computadora
EXPOSE 8080
# Definición del comando que se ejecutará al iniciar el contenedor
CMD [ "npm", "start"]