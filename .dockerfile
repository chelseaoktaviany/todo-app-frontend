FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

ENV PORT=8000

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]