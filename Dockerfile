# Dockerfile para aplicação NestJS
FROM node:18-alpine

# Diretório de trabalho dentro do container
WORKDIR /app

# Copiar package.json e yarn.lock para instalar dependências
COPY package.json yarn.lock ./

# Instalar dependências
RUN yarn install

# Copiar todo o código para dentro do container
COPY . .

# Build da aplicação
RUN yarn build

# Expor a porta padrão do NestJS
EXPOSE 3000

# Comando para rodar a aplicação em produção
CMD ["node", "dist/main.js"]
