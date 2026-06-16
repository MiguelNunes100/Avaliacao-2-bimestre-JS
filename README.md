# Catálogo de Produtos — API REST com Node.js + MySQL

**Avaliação do 2º Bimestre — Linguagem de Programação para Web I (JavaScript)**  
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

#### Opção A — Script Python (recomendado, automático) 🐍

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
4. Clique no botão **⚡ Execute** (ou `Ctrl + Shift + Enter`)
5. No painel **Schemas** à esquerda, clique em 🔄 — o banco `loja_db` vai aparecer

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

> ⚠️ O arquivo `.env` **não vai para o GitHub** (está no `.gitignore`).  
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

## Estrutura do projeto

```
Avaliacao-2-bimestre-JS/
├── banco-de-dados/
│   └── loja_db.sql              # Script para criar o banco
├── public/
│   ├── index.html               # Interface do usuário
│   └── app.js                   # JavaScript do frontend
├── src/
│   ├── controllers/
│   │   └── produtosController.js
│   ├── db/
│   │   └── knex.js              # Conexão com o banco
│   ├── routes/
│   │   └── produtos.js          # Rotas da API
│   └── server.js                # Entrada do servidor Express
├── .env                         # Credenciais locais (não vai ao GitHub)
├── .env-modelo                  # Modelo do .env
├── .gitignore
├── knexfile.js                  # Configuração do Knex
├── package.json
└── README.md
```

---

## Referência

Baseado no repositório do professor: https://github.com/marcioaraya/api-crud-js