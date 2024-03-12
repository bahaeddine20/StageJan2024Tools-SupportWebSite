FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install typescript@5.3
RUN npm install domino

RUN npm install -g @angular/cli
RUN npm install
COPY . .
RUN npm run build -- --configuration=production

FROM nginx:alpine
COPY --from=builder /app/dist/* /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

