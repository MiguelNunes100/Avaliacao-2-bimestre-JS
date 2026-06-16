# Catálogo de Produtos - API REST com Node.js + MySQL

**Avaliação do 2º Bimestre - Linguagem de Programação para Web I (JavaScript)**  
**Faculdade Senac · ADS · 2026**

**Grupo:**
- Miguel Miranda Nunes
- Arthur Queiroz de Andrade

---

## Tecnologias usadas

- **Backend:** Node.js · Express · Knex · MySQL2 · Dotenv · Cors
- **Frontend:** HTML · CSS · JavaScript (Fetch API)
- **Banco de dados:** MySQL

---

## Como rodar o projeto

### 1. Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (versão LTS recomendada)
- MySQL instalado e rodando localmente

---

### 2. Criar o banco de dados

#### Opção A — Script Python (automático e recomendado)

Instale as dependências Python (só na primeira vez):

```bash
pip install mysql-connector-python python-dotenv
```

Execute o script de configuração:

```bash
python banco-de-dados/criar_banco.py
```

O script vai criar o banco `loja_db`, a tabela `produtos` e inserir 3 produtos de exemplo automaticamente.

---

#### Opção B — MySQL Workbench (manual)

1. Abra o **MySQL Workbench** e conecte-se ao seu servidor MySQL
2. No menu superior, clique em **File → Open SQL Script...**
3. Navegue até `banco-de-dados/` e abra o arquivo **`loja_db.sql`**
4. Clique no botão ** Execute** (ou `Ctrl + Shift + Enter`)
5. No painel **Schemas** à esquerda, clique em - o banco `loja_db` vai aparecer

---

### 3. Configurar variáveis de ambiente

1. Na raiz do projeto, abra o arquivo **`.env`**
2. Preencha sua senha do MySQL no campo `DB_PASSWORD`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=loja_db
PORT=3000
```

> Atenção: O arquivo `.env` **não vai para o GitHub** (está no `.gitignore`).  
> Use o arquivo `.env-modelo` como referência.

---

### 4. Instalar dependências

Abra um terminal na pasta raiz do projeto e execute:

```bash
npm install
```

---

### 5. Iniciar o servidor

```bash
npm run dev
```

O servidor vai iniciar em: **http://localhost:3000**

---

## Rotas da API

| Método | Rota             | Ação                        |
|--------|------------------|-----------------------------|
| GET    | `/produtos`      | Listar todos os produtos    |
| GET    | `/produtos/:id`  | Buscar produto por ID       |
| POST   | `/produtos`      | Cadastrar novo produto      |
| PUT    | `/produtos/:id`  | Atualizar produto existente |
| DELETE | `/produtos/:id`  | Excluir produto             |

---

## Estrutura do projeto (Simplificada)

```
Avaliacao-2-bimestre-JS/
├── banco-de-dados/
│   ├── criar_banco.py           # Script Python para criação automática
│   └── loja_db.sql              # Script SQL manual para o Workbench
├── public/
│   ├── index.html               # Frontend (Estrutura da página, estilo CSS e tabelas)
│   └── app.js                   # Frontend (Comunicação com a API usando Fetch)
├── src/
│   ├── db/
│   │   └── knex.js              # Conexão e inicialização do Knex com o MySQL
│   └── server.js                # Servidor Express (Centraliza rotas e lógica da API!)
├── .env                         # Credenciais do banco (não vai ao GitHub)
├── .env-modelo                  # Modelo do arquivo .env
├── .gitignore                   # Arquivos ignorados pelo Git
├── knexfile.js                  # Configurações de conexão do Knex
├── package.json                 # Dependências do projeto Node.js
└── README.md                    # Documentação e guia de apresentação
```

---

## Guia de Apresentação Acadêmica (Roteiro da Equipe)

Este guia foi criado para ajudar o grupo (**Miguel Miranda Nunes** & **Arthur Queiroz de Andrade**) a explicar o funcionamento técnico do projeto de maneira clara e direta durante a avaliação acadêmica.

### 1. Resumo do Projeto (A "Idea" Geral)
> *"O nosso projeto é um catálogo de produtos com controle de estoque. Ele foi desenvolvido com uma arquitetura **Client-Server** (Cliente-Servidor). O cliente (frontend) é uma página web estática em HTML/CSS/JS que roda no navegador, e o servidor (backend) é uma API REST desenvolvida em Node.js com Express e Knex, integrada a um banco de dados relacional MySQL local."*

---

### 2. Fluxo da Informação (Como os dados viajam)
Explique o ciclo de vida de uma operação (por exemplo, **Cadastrar Produto**):
1. **Frontend (Navegador):** O usuário preenche o formulário e clica no botão "Salvar". O arquivo `public/app.js` captura esse evento de envio, monta um objeto JSON com os dados do produto e dispara uma requisição `POST` para `http://localhost:3000/produtos` usando a **Fetch API** do JavaScript.
2. **Backend (Servidor):** O servidor Express (`src/server.js`) intercepta a requisição na rota correspondente (`aplicacao.post('/produtos')`). Ele valida os campos obrigatórios (nome e preço).
3. **Banco de Dados (MySQL):** O Express usa a biblioteca **Knex** (`src/db/knex.js`) para fazer a inserção no MySQL. O Knex traduz o comando JavaScript `bd('produtos').insert(...)` para o comando SQL correspondente (`INSERT INTO produtos ...`) de forma transparente.
4. **Retorno:** O banco de dados insere o registro e retorna o ID. O servidor busca o produto recém-criado e envia uma resposta HTTP com o status `201 (Created)` e os dados do produto em formato JSON de volta para o navegador.
5. **Atualização da Tela:** O arquivo `public/app.js` recebe a resposta de sucesso e executa a função `carregarProdutos()`, que limpa o formulário e atualiza a tabela na tela sem precisar recarregar a página.

---

### 3. Explicando os Principais Arquivos Técnicos

* **`src/server.js` (O Coração do Backend):**
  * Explique que decidimos centralizar as rotas e a lógica no `server.js` para simplificar e tornar o entendimento mais direto.
  * Ele usa o **Express** para criar o servidor web e o **CORS** para permitir que a nossa página frontend converse com a API REST.
  * Contém os 5 endpoints do CRUD (Listar, Buscar por ID, Criar, Atualizar e Deletar) usando funções assíncronas (`async/await`) para aguardar o banco responder.
* **`src/db/knex.js` e `knexfile.js` (A Conexão):**
  * O `knexfile.js` lê as variáveis do arquivo `.env` para carregar as credenciais do MySQL de forma segura.
  * O `knex.js` inicia a instância da conexão. Usamos o construtor do Knex apontando para o ambiente de desenvolvimento.
* **`public/app.js` (O Cérebro do Frontend):**
  * Contém as funções que escutam os botões do formulário.
  * Usa o `fetch()` para fazer chamadas HTTP (GET, POST, PUT, DELETE) na API do backend.
  * Manipula dinamicamente a árvore do documento (DOM) usando `.innerHTML` e template strings para montar as linhas da tabela de produtos.

---

### 4. Dicas de Ouro para a Apresentação
* **Demonstre primeiro:** Abra o navegador, faça um cadastro rápido, atualize o preço de um produto e exclua outro para mostrar que tudo funciona em tempo real.
* **Mostre o banco atualizando:** Deixe o MySQL Workbench aberto ao lado e dê um `SELECT * FROM produtos;` após realizar alterações no site para provar que a persistência de dados está correta.
* **Mencione a segurança:** Destaque que as credenciais do banco de dados (senha do root) ficam salvas localmente no arquivo `.env` e nunca são enviadas ao GitHub através do `.gitignore`, mantendo o código seguro.

---

## Referência

Baseado no repositório do professor: https://github.com/marcioaraya/api-crud-js
