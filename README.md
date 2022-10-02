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
- [Orchestrator Service](https://github.com/DIASTEMA-UPRC/orchestrator)

### How to run

Create a `.env` file containing the following:

```
PORT=5400
MONGO_URL=mongodb://mongo/
ORCHESTRATOR_URL=http://orchestrator:5002/analysis
ORCHESTRATOR_INGESTION_URL=http://orchestrator:5002/ingestion
NORMALIZATION_URL=http://normalization:5000/normalize
VALIDATION_URL=http://validation:5001/validation
NODE_ENV=development
```

Run the following commands to install node modules and start the script for development / testing:
```
npm install
npm run docker:dev
```

The development script will also start some required services as containers:
- [Function Normalization Service](https://github.com/DIASTEMA-UPRC/complex-function-normalization)
- [Graph Validation Service](https://github.com/DIASTEMA-UPRC/graph-validation-service)
- A dummy [Data Verifier Service](https://github.com/DIASTEMA-UPRC/data-verifier)
- And a MongoDB [[4]](#4) database

You can now visit [http://localhost:5400](http://localhost:5400) where the application will be running.

### Additional scripts

Some additional npm scripts have been created to execute complex Docker commands, such as:
- `npm run docker:downdev` will stop and delete running containers in development mode
- `npm run docker:build` will build the image again and then start the development containers
- `npm run docker:prod` will start just the application container. Requires proper environment variables configuration
- `npm run docker:downprod` will stop and delete running containers in production mode

## References
1. <a id="1">https://nodejs.org/en/</a>
2. <a id="2">https://expressjs.com/</a>
3. <a id="3">https://www.docker.com/</a>
4. <a id="4">https://www.mongodb.com/</a>

## License
Licensed under the [Apache License Version 2.0](LICENSE) by [Andreas Karabetian](https://github.com/adreaskar) for the research project Diastema
