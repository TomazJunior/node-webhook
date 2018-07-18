    
FROM node:latest
RUN cd /usr/src/ && mkdir app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
EXPOSE 3010
CMD ["node", "index.js"]
