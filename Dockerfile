FROM node:20-slim

# نصب ابتدایی وابستگی‌های سیستمی
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

# نصب npm و پکیج‌ها
RUN npm install -g npm@11.2.0 && \
    npm install

COPY . .

EXPOSE 10000
CMD ["node", "index.js"]