FROM node:16.10.0

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install
#RUN npm ci --only=production

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 3000
CMD [ "node", "dist/main" ]