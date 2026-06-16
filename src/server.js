require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bd = require('./db/knex'); // Conexão com o banco de dados MySQL via Knex

const aplicacao = express();

// Middleware para servir os arquivos estáticos do frontend (HTML, CSS, JS) na pasta public
aplicacao.use(express.static(path.join(__dirname, '..', 'public')));

// Middlewares para permitir requisições de outros domínios e ler dados JSON enviados pelo cliente
aplicacao.use(cors());
aplicacao.use(express.json());

// ============================================================
// ROTAS DA API REST (CRUD de Produtos)
// ============================================================

// 1. Listar todos os produtos (GET /produtos)
aplicacao.get('/produtos', async (requisicao, resposta) => {
  try {
    const produtos = await bd('produtos').select('*').orderBy('id', 'asc');
    resposta.json(produtos);
  } catch (erro) {
    resposta.status(500).json({ erro: 'Erro ao listar produtos' });
  }
});

// 2. Buscar um único produto por ID (GET /produtos/:id)
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

// 3. Cadastrar um novo produto (POST /produtos)
aplicacao.post('/produtos', async (requisicao, resposta) => {
  try {
    const { nome, descricao, preco, quantidade, categoria, imagem_url, codigo_sku, fornecedor } = requisicao.body;

    // Validação de campos obrigatórios
    if (!nome || !preco) {
      return resposta.status(400).json({ erro: 'Nome e preço são obrigatórios' });
    }

    // Insere o produto no banco e retorna o ID gerado
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

    // Busca o produto recém-cadastrado para retornar na resposta
    const novoProduto = await bd('produtos').where({ id }).first();
    resposta.status(201).json(novoProduto);
  } catch (erro) {
    if (erro.code === 'ER_DUP_ENTRY') {
      return resposta.status(400).json({ erro: 'Código SKU já cadastrado' });
    }
    resposta.status(500).json({ erro: 'Erro ao cadastrar produto' });
  }
});

// 4. Atualizar um produto existente (PUT /produtos/:id)
aplicacao.put('/produtos/:id', async (requisicao, resposta) => {
  try {
    const id = requisicao.params.id;
    
    // Verifica se o produto existe
    const produto = await bd('produtos').where({ id }).first();
    if (!produto) {
      return resposta.status(404).json({ erro: 'Produto não encontrado' });
    }

    const { nome, descricao, preco, quantidade, categoria, imagem_url, codigo_sku, fornecedor } = requisicao.body;

    // Atualiza os dados no banco
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

    // Busca o produto atualizado para retornar na resposta
    const produtoAtualizado = await bd('produtos').where({ id }).first();
    resposta.json(produtoAtualizado);
  } catch (erro) {
    if (erro.code === 'ER_DUP_ENTRY') {
      return resposta.status(400).json({ erro: 'Código SKU já cadastrado' });
    }
    resposta.status(500).json({ erro: 'Erro ao atualizar produto' });
  }
});

// 5. Excluir um produto por ID (DELETE /produtos/:id)
aplicacao.delete('/produtos/:id', async (requisicao, resposta) => {
  try {
    const id = requisicao.params.id;

    // Verifica se o produto existe
    const produto = await bd('produtos').where({ id }).first();
    if (!produto) {
      return resposta.status(404).json({ erro: 'Produto não encontrado' });
    }

    // Exclui o registro no banco
    await bd('produtos').where({ id }).delete();
    resposta.json({ mensagem: 'Produto excluído com sucesso!' });
  } catch (erro) {
    resposta.status(500).json({ erro: 'Erro ao excluir produto' });
  }
});

// ============================================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================================
const porta = process.env.PORT || 3000;
aplicacao.listen(porta, () => {
  console.log(`Servidor rodando em http://localhost:${porta}`);
});
