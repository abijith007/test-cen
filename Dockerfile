FROM node:10-alpine as builder

EXPOSE 600

RUN mkdir /cookie-test-folder

WORKDIR /cookie-test-folder

COPY package.json package-lock.json ./

RUN npm install 


COPY . .


# Stage 2 - Deploy with NGNIX
FROM nginx:1.16.0-alpine

COPY . .

COPY --from=builder /cookie-test-folder/index.html /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 500

CMD ["nginx", "-g", "daemon off;"]
