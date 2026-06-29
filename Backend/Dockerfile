FROM node:20-slim
WORKDIR /app

# Install python and pip, along with C++ tools needed for face_recognition (dlib)
RUN apt-get update && apt-get install -y python3 python3-pip python-is-python3 build-essential cmake

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Install Python requirements
RUN pip install -r requirements.txt --break-system-packages

# Build the TypeScript project
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
