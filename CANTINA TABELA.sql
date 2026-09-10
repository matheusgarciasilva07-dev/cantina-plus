-- ==========================================
-- CANTINA+ - BANCO DE DADOS
-- PostgreSQL / pgAdmin 4
-- ==========================================

-- APAGA AS TABELAS CASO JÁ EXISTAM
DROP TABLE IF EXISTS itens_pedido CASCADE;
DROP TABLE IF EXISTS pedidos CASCADE;
DROP TABLE IF EXISTS produtos CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;


-- ==========================================
-- TABELA: USUARIOS
-- ==========================================

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================
-- TABELA: CATEGORIAS
-- ==========================================

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);


-- ==========================================
-- TABELA: PRODUTOS
-- ==========================================

CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco NUMERIC(10,2) NOT NULL,
    categoria_id INTEGER NOT NULL,
    imagem TEXT,
    badge VARCHAR(50),
    avaliacao NUMERIC(2,1),
    tempo_preparo INTEGER,
    ativo BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES categorias(id)
);


-- ==========================================
-- TABELA: PEDIDOS
-- ==========================================

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    usuario_id INTEGER,
    nome_cliente VARCHAR(100) NOT NULL,
    forma_pagamento VARCHAR(20) NOT NULL,
    valor_total NUMERIC(10,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'pendente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
);


-- ==========================================
-- TABELA: ITENS DO PEDIDO
-- ==========================================

CREATE TABLE itens_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL,
    produto_id INTEGER NOT NULL,
    quantidade INTEGER NOT NULL,
    preco_unitario NUMERIC(10,2) NOT NULL,

    CONSTRAINT fk_pedido
        FOREIGN KEY (pedido_id)
        REFERENCES pedidos(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_produto
        FOREIGN KEY (produto_id)
        REFERENCES produtos(id)
);


-- ==========================================
-- CATEGORIAS
-- ==========================================

INSERT INTO categorias (nome) VALUES
('Salgados'),
('Lanches'),
('Doces'),
('Bebidas');


-- ==========================================
-- PRODUTOS DO CARDÁPIO
-- ==========================================

INSERT INTO produtos
(nome, descricao, preco, categoria_id, imagem, badge, avaliacao, tempo_preparo)
VALUES

(
    'Suco de Laranja',
    'Suco de laranja natural espremido na hora, gelado e sem conservantes',
    8.00,
    4,
    'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop&auto=format',
    '🍊 NATURAL',
    4.9,
    3
),

(
    'Esfiha de Carne',
    'Esfiha fechada recheada com carne moída bem temperada, quentinha',
    8.00,
    1,
    'https://images.unsplash.com/photo-1653982960203-c8361d7bed96?w=400&h=300&fit=crop&auto=format',
    '🔥 FAVORITO',
    4.8,
    5
),

(
    'Esfiha Doce',
    'Esfiha doce recheada com chocolate ou doce de leite, irresistível!',
    8.00,
    3,
    'https://images.unsplash.com/photo-1564354273277-c6d4b8532100?w=400&h=300&fit=crop&auto=format',
    '😍 DELÍCIA',
    4.9,
    5
),

(
    'Pedaço de Bolo',
    'Fatia de bolo caseiro do dia — chocolate, laranja ou cenoura com cobertura',
    8.00,
    3,
    'https://images.unsplash.com/photo-1517427294546-5aa121f68e8a?w=400&h=300&fit=crop&auto=format',
    NULL,
    4.8,
    2
),

(
    'Salgado',
    'Salgado assado ou frito do dia — coxinha, risole, empada ou quibe',
    8.00,
    1,
    'https://images.unsplash.com/photo-1641848421532-b27f3819071c?w=400&h=300&fit=crop&auto=format',
    '⚡ QUENTINHO',
    4.7,
    5
),

(
    'Doguinho',
    'Mini hot dog com salsicha, molho de tomate, mostarda e ketchup',
    8.00,
    2,
    'https://images.unsplash.com/photo-1613482084286-41f25b486fa2?w=400&h=300&fit=crop&auto=format',
    '🌭 HIT',
    4.9,
    6
),

(
    'Salgadinho',
    'Pacotinho de salgadinho crocante — sabores variados: queijo, churrasco ou frango',
    8.00,
    2,
    'https://images.unsplash.com/photo-1613919113640-25732ec5e61f?w=400&h=300&fit=crop&auto=format',
    NULL,
    4.6,
    1
),

(
    'Polvilho',
    'Biscoito de polvilho crocante e levinho, salgado ou doce. Pacote individual',
    8.00,
    2,
    'https://images.unsplash.com/photo-1699666397768-0126340e880a?w=400&h=300&fit=crop&auto=format',
    NULL,
    4.7,
    1
);


-- ==========================================
-- VERIFICAR OS DADOS
-- ==========================================

SELECT * FROM categorias;

SELECT * FROM produtos;

SELECT * FROM usuarios;

SELECT * FROM pedidos;

SELECT * FROM itens_pedido;.





































































































































































































































































































































































































































































































































































































































































