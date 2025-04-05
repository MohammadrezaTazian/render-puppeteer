FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-kacst \
    fonts-freefont-ttf

COPY . .

CMD ["node", "index.js"]