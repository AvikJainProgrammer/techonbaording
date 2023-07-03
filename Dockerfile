# Use official node image as the base image
FROM node:latest

# Set /app as the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies in the container
RUN npm install

# Copy the rest of your app's source code to the working directory
COPY . .

# Expose port 5000 for the app
EXPOSE 5000

# Run the app
CMD [ "node", "index.js" ]
