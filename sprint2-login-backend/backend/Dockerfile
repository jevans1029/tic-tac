FROM node:18

RUN apt-get update && apt-get install -y netcat-traditional
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY wait-for.sh /app/wait-for.sh
RUN chmod +x /app/wait-for.sh

EXPOSE 3000
