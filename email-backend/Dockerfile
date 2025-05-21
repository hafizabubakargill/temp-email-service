
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose SMTP and API ports
EXPOSE 2525
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Run the application
CMD ["node", "src/index.js"]
