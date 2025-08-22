# EspimApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.0.

## Requisitos

- Node v14.6.0 ou superior
- Docker version 20.10.6 ou superior

## Instalação

Para instalar, precisa instalar as dependências NPM através do comando:

- `npm install --legacy-peer-deps`

## Server de desenvolvimento

Execute `ng serve` para um servidor de desenvolvimento. Navegue até `http://localhost:4200/`. O aplicativo será recarregado automaticamente se você alterar qualquer um dos arquivos de origem.

## Server de teste

Para fazer o build, precisa rodar os seguintes comandos docker:

- `docker-compose -f docker-compose-desenvolvimento.yml build --no-cache`
- `docker-compose -f docker-compose-desenvolvimento.yml up -d`

Que irá habilitar o serviço do nginx, apontando para a pasta `/dist`.

- **nginx** - `:80`

## Server de produção

Primeiro, você terá que rodar o front-end sem SSL, e dessa forma, gerar o Certificado:

- `docker-compose -f docker-compose-validar-certificado.yml build --no-cache`
- `docker-compose -f docker-compose-validar-certificado.yml up -d`
- `docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ -d espim.icmc.usp.br`
- `docker-compose -f docker-compose-validar-certificado.yml stop`

Feito isso, serão gerados os certificados, e então, você pode subir o servidor de produção (com configurações ssl):

- `docker-compose build --no-cache`
- `docker-compose up -d`

Que irá habilitar o serviço do nginx, apontando para a pasta `/dist`.

- **nginx** - `:443`

## Renovação do certificado

Para renovar o certificado, será necessário criar um cron no servidor para rodar o seguinte comando:

- `docker-compose run --rm certbot renew`

Exemplo:

- `crontab -e`
- `0 5 1 */2 * /usr/bin/docker-compose -f /home/eadriano/sistema/espim-frontend-2021/docker-compose.yml run --rm certbot renew`
