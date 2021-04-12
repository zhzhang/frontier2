FROM node:15

RUN apt-get update
RUN apt-get install mysql-server

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
