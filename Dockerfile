FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --location=global nodemon
RUN npm install
COPY . .
CMD ["npm", "run", "start"]
EXPOSE 8080

#Build to project
# RUN npm run build

# Run node server
# CMD npm run start