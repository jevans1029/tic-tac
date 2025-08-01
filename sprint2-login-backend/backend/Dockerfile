FROM node:24-alpine

WORKDIR /app

# Add non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package*.json ./
RUN npm install
COPY . .

# Set proper ownership
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000
CMD ["npm", "run", "dev"]
