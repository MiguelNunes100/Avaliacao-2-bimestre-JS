const URL_API = 'http://localhost:3000/produtos';

function mostrarMensagem(texto, tipo) {
  const caixaMensagem = document.getElementById('mensagem');
  caixaMensagem.textContent = texto;
  caixaMensagem.className = tipo;
  setTimeout(() => {
    caixaMensagem.className = '';
    caixaMensagem.textContent = '';
  }, 4000);
}

function formatarPreco(valor) {
  return parseFloat(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

async function carregarProdutos() {
  const corpo = document.getElementById('corpoTabela');
  try {
    const resposta = await fetch(URL_API);
    const produtos = await resposta.json();

    if (produtos.length === 0) {
      corpo.innerHTML = '<tr><td colspan="8" id="semProdutos">Nenhum produto cadastrado.</td></tr>';
      return;
    }

    corpo.innerHTML = produtos.map(produto => `
      <tr>
        <td>${produto.id}</td>
        <td>${produto.nome}</td>
        <td>${produto.codigo_sku || '-'}</td>
        <td>${produto.categoria || '-'}</td>
        <td>${formatarPreco(produto.preco)}</td>
        <td>${produto.quantidade}</td>
        <td>${produto.fornecedor || '-'}</td>
        <td>
          <button class="btn-editar" onclick="editarProduto(${produto.id})">Editar</button>
          <button class="btn-excluir" onclick="excluirProduto(${produto.id})">Excluir</button>
        </td>
      </tr>
    `).join('');
  } catch (erro) {
    corpo.innerHTML = '<tr><td colspan="8" style="color:red;text-align:center;">Erro ao conectar com o servidor. Verifique se ele está rodando.</td></tr>';
  }
}

async function editarProduto(id) {
  try {
    const resposta = await fetch(`${URL_API}/${id}`);
    const produto = await resposta.json();

    document.getElementById('campoId').value        = produto.id;
    document.getElementById('campoNome').value       = produto.nome;
    document.getElementById('campoCodigo').value     = produto.codigo_sku || '';
    document.getElementById('campoDescricao').value  = produto.descricao || '';
    document.getElementById('campoPreco').value      = produto.preco;
    document.getElementById('campoQuantidade').value = produto.quantidade;
    document.getElementById('campoCategoria').value  = produto.categoria || '';
    document.getElementById('campoFornecedor').value = produto.fornecedor || '';
    document.getElementById('campoImagem').value     = produto.imagem_url || '';

    document.getElementById('tituloFormulario').textContent = 'Editar Produto (ID: ' + produto.id + ')';
    document.getElementById('btnSalvar').textContent = 'Atualizar';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (erro) {
    mostrarMensagem('Erro ao carregar dados do produto.', 'erro');
  }
}

async function excluirProduto(id) {
  if (!confirm('Tem certeza que deseja excluir este produto?')) return;

  try {
    const resposta = await fetch(`${URL_API}/${id}`, { method: 'DELETE' });
    const dados = await resposta.json();

    if (resposta.ok) {
      mostrarMensagem(dados.mensagem, 'sucesso');
      carregarProdutos();
    } else {
      mostrarMensagem(dados.erro || 'Erro ao excluir produto.', 'erro');
    }
  } catch (erro) {
    mostrarMensagem('Erro ao conectar com o servidor.', 'erro');
  }
}

function limparFormulario() {
  document.getElementById('formularioProduto').reset();
  document.getElementById('campoId').value = '';
  document.getElementById('tituloFormulario').textContent = 'Cadastrar Novo Produto';
  document.getElementById('btnSalvar').textContent = 'Salvar';
}

document.getElementById('formularioProduto').addEventListener('submit', async function (evento) {
  evento.preventDefault();

  const id          = document.getElementById('campoId').value;
  const nome        = document.getElementById('campoNome').value.trim();
  const codigo_sku  = document.getElementById('campoCodigo').value.trim();
  const descricao   = document.getElementById('campoDescricao').value.trim();
  const preco       = document.getElementById('campoPreco').value;
  const quantidade  = document.getElementById('campoQuantidade').value;
  const categoria   = document.getElementById('campoCategoria').value.trim();
  const fornecedor  = document.getElementById('campoFornecedor').value.trim();
  const imagem_url  = document.getElementById('campoImagem').value.trim();

  const dadosProduto = { nome, descricao, preco, quantidade, categoria, imagem_url, codigo_sku, fornecedor };

  try {
    let resposta;

    if (id) {
      resposta = await fetch(`${URL_API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosProduto)
      });
    } else {
      resposta = await fetch(URL_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosProduto)
      });
    }

    const dados = await resposta.json();

    if (resposta.ok) {
      mostrarMensagem(id ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!', 'sucesso');
      limparFormulario();
      carregarProdutos();
    } else {
      mostrarMensagem(dados.erro || 'Erro ao salvar produto.', 'erro');
    }
  } catch (erro) {
    mostrarMensagem('Erro ao conectar com o servidor.', 'erro');
  }
});

document.getElementById('btnLimpar').addEventListener('click', limparFormulario);

carregarProdutos();
