# AMPI-AB 

Um painel de front-end desenvolvido em Angular para visualização de informações de usuários.

---

## Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Pré-requisitos](#-pré-requisitos)
- [Como Rodar o Projeto](#-como-rodar-o-projeto)

---

## Sobre o Projeto

O **AMPI-AB** é um projeto feito em parceria entre o Departamento de Gerontologia da UFSCar e o Departamento de Computação da USP - São Carlos. Ele foi desenvolvido para modernizar o projeto "AMPI-AB", que antes era feito em papel, usando o app 
para coleta de dados dos usuários e o site web para gerenciamento e manutenção de intervenções e visualização dos dados. O AMPI-AB é uma funcionalidade criada dentro do ESPIM, uma plataforma de criação e gerenciamento de intervenções desenvolvido
pela USP - São Carlos, e por conta da sua utilidade para o projeto, foi conveniente integrar o AMPI-AB nessa aplicação. O meu papel no projeto foi principalmente cuidar da parte de tornar a visualização de dados mais fácil e intuitiva, sendo
criado na parte de resultados a aba "AMPI-AB", e nela possui as funcionalidades abaixo listadas.

INFORMAÇÕES IMPORTANTES:
- O projeto não teve continuidade por desentendimento no gerenciamento de tempo e planejamento do projeto. Então são usados dados simulados e nomes fictícios para testar o comportamento dos gráficos e tabelas.
- Por conta do tópico acima, o site está com problemas de login, e para ser visto o que eu fiz no projeto, eu comentei a opção de login no projeto (LoggedInGuard). Então, para acessar o conteúdo do site basta
  acrescentar o endpoint '/private' no localhost.
---

## Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias:

-   **[Angular](https://angular.io/)** (Framework principal)
-   **[TypeScript](https://www.typescriptlang.org/)** (Linguagem base para o Angular)
-   **[Angular CLI](https://angular.io/cli)** (Interface de linha de comando para gerenciar o projeto)
-   **[RxJS](https://rxjs.dev/)** (Para programação reativa e gerenciamento de operações assíncronas)
-   **[NPM](https://www.npmjs.com/)** (Gerenciador de pacotes)

---

## Pré-requisitos

Antes de começar, você vai precisar ter as seguintes ferramentas instaladas em sua máquina:
-   [Node.js (versão 18.x ou superior)](https://nodejs.org/en)
-   [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
-   [Angular CLI](https://angular.io/cli)
-   Um editor de código, como o [VSCode](https://code.visualstudio.com/)

---

## Como Rodar o Projeto

Siga os passos abaixo para configurar e rodar o projeto localmente.

```bash
# 1. Clone este repositório
$ git clone [https://github.com/MurilooMiranda/AMPI-AB.git](https://github.com/MurilooMiranda/AMPI-AB.git)

# 2. Navegue até o diretório do projeto
$ cd AMPI-AB

# 3. Instale as dependências
$ npm install -g @angular/cli --legacy-peer-deps

# 4. Rode o projeto em modo de desenvolvimento
$ ng serve

# 5. Acesse o projeto no seu navegador
 O servidor de desenvolvimento será iniciado, geralmente em http://localhost:5173 (dependendo da sua máquina)

# 6. Ver a página AMPI-AB
 Mude o endpoint para '/private'
 Vá em 'Resultados' e selecione a opção 'AMPI-AB' 

```
**Observação:** Como comentado acima, este é um projeto de front-end. Ele precisa se conectar a uma API de backend para que as funcionalidades de cadastro, login e exibição de dados funcionem corretamente. Certifique-se de que o backend está rodando e acessível na URL configurada no arquivo `.env`.
