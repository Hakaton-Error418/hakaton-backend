FROM node:23.6.0
WORKDIR /app
COPY pacage.json .
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]