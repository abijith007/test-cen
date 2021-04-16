FROM node:10-alpine as builder

COPY package.json package-lock.json ./

RUN npm install 

COPY . .

RUN npm start

# Stage 2 - Deploy with NGNIX
FROM nginx:1.16.0-alpine

COPY --from=builder /index.html /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
