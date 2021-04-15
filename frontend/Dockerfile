FROM node:latest AS builder
WORKDIR /app
COPY . .
RUN yarn
RUN yarn prettier
RUN yarn lint
RUN yarn build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
