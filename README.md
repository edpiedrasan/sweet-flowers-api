# Smart & Simple API REST

![version](https://img.shields.io/badge/version-1.0.0-blue.svg)

API construido en express para el desarrollo de todos los endpoints necesarios utilizados por el sitio WEB Sweet Flowers

## Tabla de Contenidos

- [Prerequisitos](#prerequisitos)
- [Características](#caracteristicas)
- [Inicio Rapido](#inicio-rapido)
  - [Instalación](#instalacion)
  - [Estructura del directorio](#estrutura-del-directorio)
  - [Rutas disponibles](#rutas-disponibles)
  - [Comandos disponibles](#comandos-disponibles)
- [Autores](#autores)



## Prerequisitos

Necesitas instalar un editor de código [VSCode](https://code.visualstudio.com/download) es nuestra recomendación.

## Características

- [JavaScript](https://www.javascript.com/) como lenguaje.

- Framework: [Express.js](https://expressjs.com/es/)

- Autenticación y autorización con [JSON Web Tokens](https://jwt.io/)

- [EditorConfig](https://editorconfig.org/)
  para mantener un estilo de codificación consistente.

- [Morgan](https://github.com/expressjs/morgan) para seguimiento de logs de las solicitudes.

- Usando las últimas características de ES6 / ES7 como `async-await`

## Inicio rapido

### Instalación

1. Instalar las dependencias usando `npm install` o `npm i`

2. Iniciar la aplicación usando `npm run dev`

3. Por último, ingresar a: `http://localhost:33583/<su_ruta>`

### Estructura del directorio

```
├── src
│   ├── assets
│   ├── components
│   ├── config
│   ├── db
│   ├── helpers
│   ├── services
│   ├── app.js
│   └── index.js
├── .babelcr
├── .editorconfig
├── .eslintrc.js
├── .gitignore
├── docker-compose.yml
├── package-lock.json
├── package.json
└── README.md
```

### Rutas disponibles

| Method   | Resource        | Description                                                               |
| :------- | :-------------- | --------------------------------------------------------------------------|

### Comandos disponibles

- `dev` - Para ejecutar la aplicación en desarrollo.

## Autores ✒️

* **Eduardo Piedra Sanabria** - *Software Development* - [edpiedrasan](https://github.com/edpiedrasan/)


