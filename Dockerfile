FROM node:20
RUN npm install -g @angular/cli@18.2.0
RUN mkdir /code
WORKDIR /code
COPY ./ /code/
RUN rm -r /code/node_modules/
RUN npm install --legacy-peer-deps
