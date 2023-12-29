FROM node:16

WORKDIR /app
COPY app/package*.json /app
RUN npm install
COPY app /app


CMD ["npm", "run", "dev"]