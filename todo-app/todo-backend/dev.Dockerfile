FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm install -g nodemon


EXPOSE 3001

CMD ["nodemon", "index.js"]
