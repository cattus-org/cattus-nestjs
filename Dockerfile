# Dockerfile para aplicação NestJS
FROM node:18-alpine

# Diretório de trabalho dentro do container
WORKDIR /app

# Copiar package.json e package-lock.json para instalar dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o código para dentro do container
COPY . .

# Build da aplicação
RUN npm run build

# Expor a porta padrão do NestJS
EXPOSE 3000

# Comando para rodar a aplicação em produção
CMD ["node", "dist/main.js"]
