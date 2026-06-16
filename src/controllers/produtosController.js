const bd = require('../db/knex');

// Listar todos os produtos
exports.listar = async (requisicao, resposta) => {
  try {
    const produtos = await bd('produtos').select('*').orderBy('id', 'asc');
    resposta.json(produtos);
  } catch (erro) {
    console.error('[ERRO listar]', erro.message);
    resposta.status(500).json({ erro: 'Erro ao listar produtos', detalhe: erro.message });
  }
};

// Obter um produto pelo ID
exports.obter = async (requisicao, resposta) => {
  try {
    const produto = await bd('produtos').where({ id: requisicao.params.id }).first();
    if (!produto) {
      return resposta.status(404).json({ erro: 'Produto não encontrado' });
    }
    resposta.json(produto);
  } catch (erro) {
    resposta.status(500).json({ erro: 'Erro ao buscar produto' });
  }
};

// Criar um novo produto
exports.criar = async (requisicao, resposta) => {
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
    resposta.status(500).json({ erro: 'Erro ao criar produto' });
  }
};

// Atualizar um produto existente
exports.atualizar = async (requisicao, resposta) => {
  try {
    const produto = await bd('produtos').where({ id: requisicao.params.id }).first();
    if (!produto) {
      return resposta.status(404).json({ erro: 'Produto não encontrado' });
    }

    const { nome, descricao, preco, quantidade, categoria, imagem_url, codigo_sku, fornecedor } = requisicao.body;

    await bd('produtos').where({ id: requisicao.params.id }).update({
      nome,
      descricao,
      preco,
      quantidade,
      categoria,
      imagem_url,
      codigo_sku,
      fornecedor
    });

    const produtoAtualizado = await bd('produtos').where({ id: requisicao.params.id }).first();
    resposta.json(produtoAtualizado);
  } catch (erro) {
    if (erro.code === 'ER_DUP_ENTRY') {
      return resposta.status(400).json({ erro: 'Código SKU já cadastrado' });
    }
    resposta.status(500).json({ erro: 'Erro ao atualizar produto' });
  }
};

// Excluir um produto
exports.excluir = async (requisicao, resposta) => {
  try {
    const produto = await bd('produtos').where({ id: requisicao.params.id }).first();
    if (!produto) {
      return resposta.status(404).json({ erro: 'Produto não encontrado' });
    }

    await bd('produtos').where({ id: requisicao.params.id }).delete();
    resposta.json({ mensagem: 'Produto excluído com sucesso' });
  } catch (erro) {
    resposta.status(500).json({ erro: 'Erro ao excluir produto' });
  }
};
