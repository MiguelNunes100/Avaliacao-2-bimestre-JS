require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bd = require('./db/knex');

const aplicacao = express();

aplicacao.use(express.static(path.join(__dirname, '..', 'public')));

aplicacao.use(cors());
aplicacao.use(express.json());

aplicacao.get('/produtos', async (requisicao, resposta) => {
  try {
    const produtos = await bd('produtos').select('*').orderBy('id', 'asc');
    resposta.json(produtos);
  } catch (erro) {
    resposta.status(500).json({ erro: 'Erro ao listar produtos' });
  }
});

aplicacao.get('/produtos/:id', async (requisicao, resposta) => {
  try {
    const produto = await bd('produtos').where({ id: requisicao.params.id }).first();
    if (!produto) {
      return resposta.status(404).json({ erro: 'Produto não encontrado' });
    }
    resposta.json(produto);
  } catch (erro) {
    resposta.status(500).json({ erro: 'Erro ao obter produto' });
  }
});

aplicacao.post('/produtos', async (requisicao, resposta) => {
  try {
    const { nome, descricao, preco, quantidade, categoria, imagem_url, codigo_sku, fornecedor } = requisicao.body;

    if (!nome || !preco) {
      return resposta.status(400).json({ erro: 'Nome e preço são obrigatórios' });
    }

    const [id] = await bd('produtos').insert({
      nome,
      descricao,
      preco,
      quantidade: quantidade || 0,
      categoria,
      imagem_url,
      codigo_sku,
      fornecedor
    });

    const novoProduto = await bd('produtos').where({ id }).first();
    resposta.status(201).json(novoProduto);
  } catch (erro) {
    if (erro.code === 'ER_DUP_ENTRY') {
      return resposta.status(400).json({ erro: 'Código SKU já cadastrado' });
    }
    resposta.status(500).json({ erro: 'Erro ao cadastrar produto' });
  }
});

aplicacao.put('/produtos/:id', async (requisicao, resposta) => {
  try {
    const id = requisicao.params.id;
    
    const produto = await bd('produtos').where({ id }).first();
    if (!produto) {
      return resposta.status(404).json({ erro: 'Produto não encontrado' });
    }

    const { nome, descricao, preco, quantidade, categoria, imagem_url, codigo_sku, fornecedor } = requisicao.body;

    await bd('produtos').where({ id }).update({
      nome,
      descricao,
      preco,
      quantidade,
      categoria,
      imagem_url,
      codigo_sku,
      fornecedor
    });

    const produtoAtualizado = await bd('produtos').where({ id }).first();
    resposta.json(produtoAtualizado);
  } catch (erro) {
    if (erro.code === 'ER_DUP_ENTRY') {
      return resposta.status(400).json({ erro: 'Código SKU já cadastrado' });
    }
    resposta.status(500).json({ erro: 'Erro ao atualizar produto' });
  }
});

aplicacao.delete('/produtos/:id', async (requisicao, resposta) => {
  try {
    const id = requisicao.params.id;

    const produto = await bd('produtos').where({ id }).first();
    if (!produto) {
      return resposta.status(404).json({ erro: 'Produto não encontrado' });
    }

    await bd('produtos').where({ id }).delete();
    resposta.json({ mensagem: 'Produto excluído com sucesso!' });
  } catch (erro) {
    resposta.status(500).json({ erro: 'Erro ao excluir produto' });
  }
});

const porta = process.env.PORT || 3000;
aplicacao.listen(porta, () => {
  console.log(`Servidor rodando em http://localhost:${porta}`);
});
