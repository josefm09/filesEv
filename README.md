# filesEv

Api con autenticación JWT para obtener los resultados de los análisis de sentimiento en los comentarios consumiento la Api [SENTIM](https://sentim-api.herokuapp.com/)

## Tabla de contenido

1. [Configuración inicial](#configuracion-inicial)
   1. [Motivación](#motivacion)
      1. [Levantando el proyecto](#levantando-el-proyecto)
      2. [Composición del proyecto](#composicion-del-proyecto)
   2. [Docker y docker compose](#docker-y-docker-compose)
      1. [Instalacion de docker](#instalacion-de-docker)
         1. [Ubuntu 16](#ubuntu-16)
         2. [Ubuntu 18](#ubuntu-18)
         3. [Instalación de docker compose](#instalacion-de-docker-compose)
2. [Trabajar en modo desarrollo](#trabajar-en-modo-desarrollo)
3. [Endpoints](#endpoints)
   1. [Firma del token](#firma-del-token)
      1. [Parametros](#parametros-de-la-firma)
      2. [Ruta](#ruta-login)
      3. [Respuesta ejemplo](#respuesta-ejemplo-login)
   2. [Registro usuarios](#registro-usuarios)
      1. [Parametros](#parametros-del-registro)
      2. [Ruta](#ruta-registro)
      3. [Respuesta ejemplo](#respuesta-ejemplo-registro)
   3. [Subir archivos al servidor](#subir-archivos-al-servidor)
      1. [Parametros](#parametros-subir-archivos)
      2. [Ruta](#ruta-subir-archivos)
      3. [Respuesta ejemplo](#respuesta-ejemplo-subir-archivos)
   4. [Gets](#gets)
      1. [Parametros](#parametros-gets)
      2. [Ruta](#ruta-gets)
      3. [Respuesta ejemplo](#respuesta-ejemplo-gets)

## Configuración inicial

### Motivación

Este proyecto se desarrolló a medida de cumplir con un challenge el cual consiste en desarrollar una mejor herramienta para que el proceso de subir los comentarios a un servidor para porsteriromente ser analizados por la api [SENTIM](https://sentim-api.herokuapp.com/) sea más conveniente para
nuestros colaboradores y deshacerse de la preocupación por la seguridad.

#### Levantando el proyecto

para correr el proyecto en desarollo basta con hacer clone del proyecto, npm install y levantarlo con npm start

```bash
git clone https://github.com/josefm09/filesEv.git
cd filesEv
npm install
npm start
```

NOTA - tambien es necesario agregar un archivo config.js que contenga lo siguiente

```javaScript
module.exports = {
    PORT: process.env.PORT || 8080,
    MONGODB_URI: process.env.MONGODB_URI || (`direccion del servidor de mongo`),
    SECRET: process.env.SECRET || 'Super secret para codificar el token'
}
```

#### Composición del proyecto

la estructura principal de la carpeta del proyecto el la siguiente

```bash
-api
--controllers 
--models
--route
--config.js
--server.js
```

## Docker y docker compose

Este es un paso recomendado pero alternativo, ya que el proyecto también se puede ejecutar sin la ventana acoplable

#### Instalación de docker

Para más información revisa la [guia de instalación](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

##### Ubuntu 16

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

sudo apt-get update

apt-cache policy docker-ce

sudo apt-get install -y docker-ce
```

##### Ubuntu 18

```bash
sudo apt-get install -y docker.io

# Para verificar que docker está correctamente instalado
sudo systemctl status docker

# Intalación de docker compose 
# la versión se debe tomar de [aquí](https://github.com/docker/compose/releases)
sudo curl -L https://github.com/docker/compose/releases/download/1.19.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

# la versión se debe tomar de [aquí](https://github.com/docker/compose/releases)
sudo docker-compose --version
```

#### Instalación de docker compose

Documentación de instalación oficial [aquí](https://docs.docker.com/compose/install/)

```bash
# Descargar los archivos en bin
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Proveer los accesos correspondientes
sudo chmod +x /usr/local/bin/docker-compose

# Revisar la instalación
docker-compose --version
```

## Trabajar en modo desarrollo

Este comando construirá una nueva imagen donde el código se agregará en un volumen para permitir su fácil edición.

```bash
docker-compose up --build -d
```

Cada vez que se ejecute este comando, se creará una nueva imagen desde cero, para reutilizar las imágenes construidas previamente ejecute sin el --buid flag

### Detener los contenedores que están corriendo

```bash
docker-compose down -v
```

## Endpoints

Los datos siempre se envían como json en el cuerpo usando el header `Content-Type: application/json` a menos que se indique lo contrario y todo a excepcion del register necesitan como header `Authorization: (token JWT del usuario)`.

### Firma del token

#### Parametros de la firma
Este endpoint se consume al momento de llenar el formulario de login para acceder al sistema.

| Key            | Type   | Required | Description                                                  |
| -------------- | ------ | -------- | ------------------------------------------------------------ |
| email        | String | Yes       | contiene los datos que se agregarán al payload del token, se valida el dominio de la empresa  |
| password | String    | Yes       | Contraseña del usario que desea acceder al sistema, no va al payload |

#### Ruta login

```text
POST /auth/sign_in
```

#### Respuesta ejemplo login

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNvY29AY29wcGVsLmNvbSIsImZ1bGxOYW1lIjoiJ2pvc2UgY2FybG9zIGZsb3JlcyBtb3JhbiciLCJfaWQiOiI2MDRmMTM0NTQxMTBjMjJmYmNiYjNjMjUiLCJpYXQiOjE2MTU4NDQzNzF9.XVkPUmVPtVsO9xuz4PFFIN54TbgRjdTjpMN5fkXd_ik"
}
```

### Registro usuarios
Endpoint para registrar usuarios desde curl, se decidió dar de alta los usuarios en vez de permitir que todos los correos con el dominio puedan acceder al sitema

#### Parametros del registro

| Key   | Type   | Required | Description             |
| ----- | ------ | -------- | ----------------------- |
| email | String | Yes      | correo del usuario a registrar |
| password | String | Yes      | contraseña para acceder al sistema |
| fullName | String | Yes      | nombre completo del usuario a registrar |

#### Ruta registro

```text
POST /auth/register
```

#### Respuesta ejemplo registro

```json
{
    "_id": "605022ef92161500121456a6",
    "email": "josefm09@coppel.com",
    "fullName": "'jose carlos flores moran'",
    "created": "2021-03-16T03:15:59.554Z",
    "__v": 0
}
```

### Subir archivos al servidor

Este endpoint es el mas importante y mas extenso, ya que se subirá a la colección de archivos la imformación obtenida por body y ademas se mandará la peticion a [SENTIM](https://sentim-api.herokuapp.com/) 

#### Parametros subir archivos

| Key   | Type   | Required | Description             |
| ----- | ------ | -------- | ----------------------- |
| fileText | String | Yes      | texto en string extraido de un TXT en el front |
| name | String | Yes      | nombre del archivo TXT |

#### Ruta subir archivos

```text
POST /upload
```

#### Respueta ejemplo subir archivos

```json
{
    "_id": "604fd44192161500121456a0",
    "fileText": "algo bien chilo",
    "name": "analyzed.txt",
    "created": "2021-03-15T21:40:17.248Z",
    "idUsuario": "604f13454110c22fbcbb3c25",
    "__v": 0
}
```

### Gets

Existen 2 metodos get en el proyecto, uno para traer la información de la colección de archivos para llenar el listado de archivos subidos, el otro para traer de la colección de análisis. 

#### Parametros subir archivos

| Key   | Type   | Required | Description             |
| ----- | ------ | -------- | ----------------------- |
| idUsuario | String | Yes      | este id se obtiene directemente de la sesion |

#### Ruta gets

```text
GET /analysis
GET /files
```

#### Respueta ejemplo gets

respuesta GET /files
```json
[
    {
        "_id": "604fccaa56ab3300120bcc39",
        "fileText": "algo bien chilo",
        "name": "analyzed.txt",
        "created": "2021-03-15T21:07:54.097Z",
        "idUsuario": "604f13454110c22fbcbb3c25",
        "__v": 0
    }
]
```

respuesta GET /analysis
```json
[
    {
        "_id": "604e7bc7a65dc1287ca2d782",
        "idUsuario": "6049c2d010a1801bd04e5ca6",
        "result": "neutral",
        "polarity": 0,
        "bestSentence": "43200",
        "created": "2021-03-14T21:10:31.606Z",
        "__v": 0
    }
]
```