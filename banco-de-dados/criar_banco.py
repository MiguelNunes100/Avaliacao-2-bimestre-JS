import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

import os
import sys

try:
    from dotenv import load_dotenv
    pasta_raiz = os.path.join(os.path.dirname(__file__), '..')
    load_dotenv(os.path.join(pasta_raiz, '.env'))
    print("[OK] Arquivo .env carregado com sucesso.")
except ImportError:
    print("[AVISO] python-dotenv não instalado. Lendo variáveis do ambiente do sistema.")

try:
    import mysql.connector
except ImportError:
    print()
    print("[ERRO] O módulo mysql-connector-python não está instalado.")
    print("       Execute o comando abaixo e tente novamente:")
    print()
    print("       pip install mysql-connector-python python-dotenv")
    print()
    sys.exit(1)

CONFIGURACAO = {
    'host':     os.getenv('DB_HOST',     'localhost'),
    'port':     int(os.getenv('DB_PORT', 3306)),
    'user':     os.getenv('DB_USER',     'root'),
    'password': os.getenv('DB_PASSWORD', ''),
}
NOME_BANCO = os.getenv('DB_NAME', 'loja_db')

SQL_CRIAR_BANCO = f"CREATE DATABASE IF NOT EXISTS `{NOME_BANCO}` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"

SQL_CRIAR_TABELA = """
CREATE TABLE IF NOT EXISTS `produtos` (
  `id`         INT           NOT NULL AUTO_INCREMENT,
  `nome`       VARCHAR(150)  NOT NULL,
  `descricao`  TEXT,
  `preco`      DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `quantidade` INT           NOT NULL DEFAULT 0,
  `categoria`  VARCHAR(100),
  `imagem_url` VARCHAR(255),
  `codigo_sku` VARCHAR(50)   UNIQUE,
  `fornecedor` VARCHAR(150),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
"""

SQL_INSERIR_EXEMPLOS = """
INSERT IGNORE INTO `produtos`
  (`nome`, `descricao`, `preco`, `quantidade`, `categoria`, `imagem_url`, `codigo_sku`, `fornecedor`)
VALUES
  ('Notebook Dell Inspiron',
   'Notebook com processador Intel Core i5, 8GB RAM, SSD 256GB',
   3499.90, 15, 'Eletrônicos', 'https://via.placeholder.com/150', 'NOTE-DELL-001', 'Dell Brasil'),

  ('Mouse sem fio Logitech',
   'Mouse wireless 2.4GHz, bateria inclusa',
   89.90, 50, 'Periféricos', 'https://via.placeholder.com/150', 'MOUS-LOG-002', 'Logitech'),

  ('Cadeira Gamer ThunderX3',
   'Cadeira ergonômica com suporte lombar e apoio de braço',
   1299.00, 8, 'Móveis', 'https://via.placeholder.com/150', 'CADE-TX3-003', 'ThunderX3');
"""

def main():
    print()
    print("=" * 55)
    print("  Configuração do Banco de Dados - Catálogo de Produtos")
    print("=" * 55)
    print(f"  Host:  {CONFIGURACAO['host']}:{CONFIGURACAO['port']}")
    print(f"  Usuário: {CONFIGURACAO['user']}")
    print(f"  Banco: {NOME_BANCO}")
    print("=" * 55)
    print()

    conexao = None
    cursor  = None

    try:
        print("[1/4] Conectando ao MySQL...")
        conexao = mysql.connector.connect(**CONFIGURACAO)
        cursor  = conexao.cursor()
        print("      Conectado com sucesso!")

        print(f"[2/4] Criando banco de dados '{NOME_BANCO}'...")
        cursor.execute(SQL_CRIAR_BANCO)
        cursor.execute(f"USE `{NOME_BANCO}`;")
        print(f"      Banco '{NOME_BANCO}' pronto!")

        print("[3/4] Criando tabela 'produtos'...")
        cursor.execute(SQL_CRIAR_TABELA)
        print("      Tabela 'produtos' criada!")

        print("[4/4] Inserindo produtos de exemplo...")
        cursor.execute(SQL_INSERIR_EXEMPLOS)
        conexao.commit()
        print(f"      {cursor.rowcount} produto(s) de exemplo inserido(s)!")

        cursor.execute("SELECT COUNT(*) FROM produtos;")
        total, = cursor.fetchone()
        print()
        print("=" * 55)
        print("  BANCO CRIADO COM SUCESSO!")
        print(f"  Total de produtos na tabela: {total}")
        print("=" * 55)
        print()
        print("  Próximo passo: npm run dev  (na raiz do projeto)")
        print()

    except mysql.connector.Error as erro:
        print()
        print(f"[ERRO MySQL] {erro}")
        print()
        if erro.errno == 1045:
            print("  >> Senha incorreta ou usuario sem permissao.")
            print("     Abra o arquivo .env e preencha: DB_PASSWORD=sua_senha")
        elif erro.errno == 2003:
            print("  >> Nao foi possivel conectar ao MySQL.")
            print("     Verifique se o MySQL esta rodando e se DB_HOST/DB_PORT estao corretos.")
        sys.exit(1)

    finally:
        if cursor:
            cursor.close()
        if conexao and conexao.is_connected():
            conexao.close()

if __name__ == '__main__':
    main()
