FROM node:20-slim

# نصب حداقل وابستگی‌های ضروری
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-freefont-ttf \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

# نصب با حداقل مصرف حافظه
RUN npm install --production --no-optional

COPY . .

CMD ["node", "index.js"]