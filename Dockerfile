FROM node:16.15.1
WORKDIR /usr/src/app
RUN npm install --location=global nodemon
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080

#Build to project
# RUN npm run build

# Run node server
CMD npm run start