FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --silent
COPY . .
RUN npm run build
RUN npm i -g serve

CMD ["serve","-s","dist","-l","5173"]
