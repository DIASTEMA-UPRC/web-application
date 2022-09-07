FROM node:17-alpine
WORKDIR /app
COPY package.json .

ARG NODE_ENV
RUN npm install

COPY . /app/
EXPOSE 5400
CMD ["node", "app.js"]