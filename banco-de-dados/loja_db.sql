-- ============================================================
-- Script SQL - Catálogo de Produtos
-- Grupo: Miguel Miranda Nunes e Arthur Queiroz de Andrade
-- Faculdade Senac - ADS - Linguagem de Programação para Web I
-- ============================================================

-- Cria o banco de dados se não existir
CREATE DATABASE IF NOT EXISTS loja_db
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

-- Seleciona o banco de dados
USE loja_db;

-- Remove a tabela se já existir (útil para recriar do zero)
DROP TABLE IF EXISTS produtos;

-- Cria a tabela de produtos
CREATE TABLE produtos (
  id         INT          NOT NULL AUTO_INCREMENT,
  nome       VARCHAR(150) NOT NULL,
  descricao  TEXT,
  preco      DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  quantidade INT          NOT NULL DEFAULT 0,
  categoria  VARCHAR(100),
  imagem_url VARCHAR(255),
  codigo_sku VARCHAR(50)  UNIQUE,
  fornecedor VARCHAR(150),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insere alguns produtos de exemplo para testar
INSERT INTO produtos (nome, descricao, preco, quantidade, categoria, imagem_url, codigo_sku, fornecedor)
VALUES
  ('Notebook Dell Inspiron', 'Notebook com processador Intel Core i5, 8GB RAM, SSD 256GB', 3499.90, 15, 'Eletrônicos', 'https://via.placeholder.com/150', 'NOTE-DELL-001', 'Dell Brasil'),
  ('Mouse sem fio Logitech', 'Mouse wireless 2.4GHz, bateria inclusa', 89.90, 50, 'Periféricos', 'https://via.placeholder.com/150', 'MOUS-LOG-002', 'Logitech'),
  ('Cadeira Gamer ThunderX3', 'Cadeira ergonômica com suporte lombar e apoio de braço', 1299.00, 8, 'Móveis', 'https://via.placeholder.com/150', 'CADE-TX3-003', 'ThunderX3');
