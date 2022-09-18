#FROM node:18.9-slim
#FROM debian:11
FROM ubuntu:22.04

# Install latest chrome dev package that will allow this version of Chromium/Pupeteer work together.
RUN  apt-get update \
     && apt-get install -y libx11-xcb1 libasound2 x11-apps libice6 libsm6 libxaw7 libxft2 libxmu6 libxpm4 libxt6 x11-apps xbitmaps gnupg2 libxtst6 libxss1 wget \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     && apt-get install -y google-chrome-unstable --no-install-recommends \
     && rm -rf /var/lib/apt/lists/*

RUN  apt-get update && \
     apt-get install -y nodejs npm python3 ffmpeg

WORKDIR /usr/bin
RUN wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp
RUN chmod -R 775 yt-dlp

WORKDIR /opt/app

# copy packages first to avoid rebuilding more docker layers constantly
COPY package.json .
COPY package-lock.json .

RUN mkdir -p /var/log/jobs
RUN npm install

COPY . .

ENTRYPOINT [ "npm", "start" ]
