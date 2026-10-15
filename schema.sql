-- ============================================================
-- IFCE IVENTUS - SISTEMA DE GERENCIAMENTO DE EVENTOS CIENTÍFICOS
-- BANCO DE DADOS: db_eventos_ifce
-- Modelo Físico Oficial - Versão 2
-- Compatível com MySQL 8.0+ e PostgreSQL (com ajustes sintáticos)
-- ============================================================

CREATE DATABASE IF NOT EXISTS db_eventos_ifce
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE db_eventos_ifce;

-- 1. Tabela USUARIO
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    matricula VARCHAR(30) NULL UNIQUE,
    perfil ENUM('ADMINISTRADOR', 'PROFESSOR', 'PARTICIPANTE')
        NOT NULL DEFAULT 'PARTICIPANTE',
    status_conta ENUM('PENDENTE', 'ATIVO', 'RECUSADO')
        NOT NULL DEFAULT 'PENDENTE',
    foto_perfil VARCHAR(255) NULL,
    telefone VARCHAR(20) NULL,
    materias VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Tabela EVENTO
CREATE TABLE evento (
    id_evento INT AUTO_INCREMENT PRIMARY KEY,
    id_organizador INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NULL,
    banner_url VARCHAR(255) NULL,
    data_inicio DATETIME NOT NULL,
    data_fim DATETIME NOT NULL,
    inicio_inscricoes DATETIME NOT NULL,
    fim_inscricoes DATETIME NOT NULL,
    local VARCHAR(100) NOT NULL,
    modalidade ENUM('Presencial', 'Online') NOT NULL DEFAULT 'Presencial',
    status ENUM('RASCUNHO', 'PUBLICADO', 'ENCERRADO', 'CANCELADO')
        NOT NULL DEFAULT 'RASCUNHO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_evento_organizador
        FOREIGN KEY (id_organizador)
        REFERENCES usuario(id_usuario)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_evento_datas
        CHECK (
            inicio_inscricoes < fim_inscricoes
            AND fim_inscricoes <= data_inicio
            AND data_inicio < data_fim
        )
) ENGINE=InnoDB;

-- 3. Tabela ATIVIDADE
CREATE TABLE atividade (
    id_atividade INT AUTO_INCREMENT PRIMARY KEY,
    id_evento INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NULL,
    tipo VARCHAR(50) NOT NULL,
    data_hora_inicio DATETIME NOT NULL,
    data_hora_fim DATETIME NOT NULL,
    local VARCHAR(100) NOT NULL,
    limite_vagas INT NOT NULL,
    carga_horaria INT NOT NULL DEFAULT 20,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_atividade_evento
        FOREIGN KEY (id_evento)
        REFERENCES evento(id_evento)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_atividade_vagas
        CHECK (limite_vagas > 0),

    CONSTRAINT chk_atividade_datas
        CHECK (data_hora_inicio < data_hora_fim)
) ENGINE=InnoDB;

-- 4. Tabela INSCRICAO
CREATE TABLE inscricao (
    id_inscricao INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_atividade INT NOT NULL,
    data_inscricao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('CONFIRMADA', 'CANCELADA')
        NOT NULL DEFAULT 'CONFIRMADA',

    CONSTRAINT uk_usuario_atividade
        UNIQUE (id_usuario, id_atividade),

    CONSTRAINT fk_inscricao_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_inscricao_atividade
        FOREIGN KEY (id_atividade)
        REFERENCES atividade(id_atividade)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 5. Tabela FREQUENCIA
CREATE TABLE frequencia (
    id_frequencia INT AUTO_INCREMENT PRIMARY KEY,
    id_inscricao INT NOT NULL UNIQUE,
    presente BOOLEAN NOT NULL DEFAULT FALSE,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_frequencia_inscricao
        FOREIGN KEY (id_inscricao)
        REFERENCES inscricao(id_inscricao)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 6. Tabela CERTIFICADO
CREATE TABLE certificado (
    id_certificado INT AUTO_INCREMENT PRIMARY KEY,
    id_frequencia INT NOT NULL UNIQUE,
    codigo_validacao VARCHAR(64) NOT NULL UNIQUE,
    data_emissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_certificado_frequencia
        FOREIGN KEY (id_frequencia)
        REFERENCES frequencia(id_frequencia)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- SEED INICIAL: DADOS MÍNIMOS PARA AMBIENTE DE PRODUÇÃO/TESTE
-- ============================================================

INSERT INTO usuario (id_usuario, nome, email, senha_hash, matricula, perfil) VALUES
(1, 'Luiz Thomas Marte Moreira', 'luiz.thomas@gmail.com', '$2b$10$w8.1fceIventusSimulatedHashPart', '123456789101112', 'PARTICIPANTE'),
(2, 'Lucas Nogueira', 'lucas.nogueira@ifce.edu.br', '$2b$10$w8.1fceIventusSimulatedHashAdm', 'ADM-2024-991', 'ADMINISTRADOR'),
(3, 'Saulo Bezerra', 'saulo_bezerra@gmail.com', '$2b$10$w8.1fceIventusSimulatedHashProf', 'DOC-8831', 'PROFESSOR');
