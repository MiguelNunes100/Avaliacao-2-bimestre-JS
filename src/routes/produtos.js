const express = require('express');
const roteador = express.Router();
const controlador = require('../controllers/produtosController');

roteador.get('/', controlador.listar);
roteador.get('/:id', controlador.obter);
roteador.post('/', controlador.criar);
roteador.put('/:id', controlador.atualizar);
roteador.delete('/:id', controlador.excluir);

module.exports = roteador;
