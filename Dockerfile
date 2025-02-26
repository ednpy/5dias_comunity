# Use the official Node.js image as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the frontend
RUN npm install --prefix ./frontend && npm run build --prefix ./frontend

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["npm", "start"]