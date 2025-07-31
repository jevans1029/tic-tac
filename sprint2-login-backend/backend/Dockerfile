FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm install

EXPOSE 3000
CMD ["npm", "run", "dev"]
RUN chmod +x /app/wait-for.sh

EXPOSE 3000
