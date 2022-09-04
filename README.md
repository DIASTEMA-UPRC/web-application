# Diastema web app

## Description
The web application of the project, utilizing a basic nodejs [[1]](#1) express [[2]](#2) API for all the different routes and functionalities. These include:
- An interactive Dashboard
- The Process Modelling component
- Dataset management interface
- A Custom Function Modelling component
- Application monitoring
- Adaptive data visualization

## How to use

### Prerequisites
- NodeJS [[1]](#1)
- Docker [[3]](#3)

### How to run

The easiest way of running the application locally is by the use of Docker. Some npm scripts have been predefined to execute complex Docker commands, such as:
- `npm run docker:prod` will start the application container with all the necessary environment variables. This command is for production purposes
- `npm run docker:downprod` will stop and delete running containers in production mode
- `npm run docker:dev` will start two containers, one for the application and one mongodb container, with the use of docker-compose. This command is for development purposes (different env variables and live server restart)
- `npm run docker:downdev` will stop and delete running containers in development mode
- `npm run docker:build` will build the image again and then start the development containers

After executing either the `docker:dev` or `docker:prod` script, you can visit [http://localhost:5400](http://localhost:5400) where the application is now running.

<ins>**Hint:**</ins> You **do not** need to run the `npm install` command, since the *npm_modules* directory is blocked from transfering to the docker container. The container will run this command during the setup phase and install all necessary npm modules.

## References
1. <a id="1">https://nodejs.org/en/</a>
2. <a id="2">https://expressjs.com/</a>
3. <a id="3">https://www.docker.com/</a>
4. <a id="4">https://mongoosejs.com/</a>
5. <a id="5">https://ejs.co/</a>

## License
Licensed under the [Apache License Version 2.0](LICENSE) by [Andreas Karabetian](https://github.com/adreaskar) for the research project Diastema
