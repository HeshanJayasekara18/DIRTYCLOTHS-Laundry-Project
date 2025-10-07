FROM node:18

WORKDIR /app

# Copy only backend package.json files
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend source code
COPY backend .

# Expose backend port (adjust if not 3000)
EXPOSE 5000


# Start backend app
CMD ["npm", "start"]
