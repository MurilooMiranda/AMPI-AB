####### github frontend-angular previous docker
#FROM node:20
#RUN npm install -g @angular/cli@18.2.0
#RUN mkdir /code
#WORKDIR /code
#COPY ./ /code/
#RUN rm -r /code/node_modules/
#RUN npm install --legacy-peer-deps
##################################################

# syntax = docker/dockerfile:experimental
# Stage 1
# FROM node:14 AS node
FROM node:20 AS node

WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm ci
RUN node_modules/.bin/ng build --prod


# Imagem final
FROM nginx:latest AS sagui-frontend
CMD ["/bin/sh",  "-c",  "addgroup -g 1000 -S www-data && adduser -u 1000 -D -S -G www-data www-data"]

VOLUME /var/cache/nginx
COPY --from=node /usr/src/app/dist/espim-frontend /usr/share/nginx/html


# Remoção de configurações não utilizadas do NGINX
RUN rm -rf /etc/nginx/"conf.d"/*

# Cópia das configurações corretas do NGINX
COPY docker/assets/production/espim-frontend /etc/nginx/sites-enabled/espim-frontend

# Cópia do build da aplicação gerado na imagem anterior
COPY docker/assets/production/espim-frontend /etc/nginx/conf.d/nginx.conf

# Configura comando inicial da imagem
CMD ["nginx", "-g", "daemon off;"]

# Configura para que o access.log e o error.log sejam exibidos no log do container
RUN ln -sf /dev/stdout /var/log/nginx/access.log && ln -sf /dev/stderr /var/log/nginx/error.log

# Expõe as portas 80 e 443
EXPOSE 80 443