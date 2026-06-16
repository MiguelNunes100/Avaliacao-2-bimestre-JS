require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const aplicacao = express();

// Middleware para arquivos estáticos (frontend)
aplicacao.use(express.static(path.join(__dirname, '..', 'public')));

// Middlewares
aplicacao.use(cors());
aplicacao.use(express.json());

// Rotas da API
const rotasProdutos = require('./routes/produtos');
aplicacao.use('/produtos', rotasProdutos);

// Inicia o servidor
const porta = process.env.PORT || 3000;
aplicacao.listen(porta, () => {
  console.log(`Servidor rodando em http://localhost:${porta}`);
});
