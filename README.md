# Diastema web app

## Description
The web application of the project, utilizing a basic nodejs [[1]](#1) express [[2]](#2) API for all the different routes and functionalities. These include:
1. An interactive Dashboard
2. The Process Modelling component
3. Dataset management interface
3. A Custom Function Modelling component
4. Application monitoring
5. Adaptive data visualization

## Repository Contents
/config
  - Contains a module that collects and exports all the environment variables so that they can be later used by the express application.

/docker
  - Contains all the `.yml` files needed to build the web application using Docker [[3]](#3). A seperate `.yml` file is used for development or production purposes.

/models
  - Includes all the mongoose [[4]](#4) models (schemas) that the express application utilizes.

/public
  - Contains all the static files (CSS), JavaScript scripts and images that the application uses.

/routes
  - Contains the code that should run on each route according to the HTTP request that it receives.

/views
  - Contains EJS [[5]](#5) files that serve as templates for rendering the final HTML of the application.

app.js
  - The main API server where all the endpoints and middleware are defined.

Dockerfile
  - The steps required for the application to be containerized.

## How to use

### Prerequisites
- NodeJS [[1]](#1)
- Docker [[3]](#3)

### How to run

The easiest way of running the application locally is by the use of Docker. Some npm scripts have been predefined to execute complex Docker commands, such as:
- `npm run docker:dev` will start two containers, one for the application and a test mongodb container with the use of docker-compose. This command is for development purposes (different env variables and live server restart)
- `npm run docker:prod` will start the application container with all the necessary environment variables. This command is for production purposes
- `npm run docker:downdev` will stop and delete running containers in development mode
- `npm run docker:downprod` will stop and delete running containers in production mode
- `npm run docker:build` will build the image again and then start the development containers

After executing either the `docker:dev` or `docker:prod` script, you can visit [http://localhost:5400](http://localhost:5400) where the application is now running.

<ins>**Hint:**</ins> You **do not** need to run the `npm install` command, since the *npm_modules* directory is blocked from transfering to the docker container. The container will run this command during the setup phase and so all npm modules will be installed.

## References
- <a id="1">[1]</a> https://nodejs.org/en/
- <a id="2">[2]</a> https://expressjs.com/
- <a id="3">[3]</a> https://www.docker.com/
- <a id="4">[4]</a> https://mongoosejs.com/
- <a id="5">[5]</a> https://ejs.co/

