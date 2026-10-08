-- ============================================================
-- BANCO DE DADOS: db_eventos_ifce
-- Modelo Físico Oficial - IFCE Campus Cedro
-- TCC Laboratório de Desenvolvimento de Software (LDS)
-- ============================================================

CREATE DATABASE IF NOT EXISTS db_eventos_ifce
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE db_eventos_ifce;

-- 1. Tabela USUARIO
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    matricula VARCHAR(30) NULL UNIQUE,
    perfil ENUM('ADMINISTRADOR', 'PROFESSOR', 'PARTICIPANTE')
        NOT NULL DEFAULT 'PARTICIPANTE',
    foto_perfil VARCHAR(255) NULL,
    telefone VARCHAR(30) NULL,
    materias VARCHAR(150) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Tabela EVENTO
CREATE TABLE IF NOT EXISTS evento (
    id_evento INT AUTO_INCREMENT PRIMARY KEY,
    id_organizador INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NULL,
    banner_url VARCHAR(255) NULL,
    local VARCHAR(100) NOT NULL DEFAULT 'Campus Cedro - IFCE',
    horario VARCHAR(50) NOT NULL DEFAULT '08:00h - 18:00h',
    modalidade ENUM('Presencial', 'Online') NOT NULL DEFAULT 'Presencial',
    data_inicio DATETIME NOT NULL,
    data_fim DATETIME NOT NULL,
    inicio_inscricoes DATETIME NOT NULL,
    fim_inscricoes DATETIME NOT NULL,
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
CREATE TABLE IF NOT EXISTS atividade (
    id_atividade INT AUTO_INCREMENT PRIMARY KEY,
    id_evento INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NULL,
    tipo VARCHAR(50) NOT NULL DEFAULT 'Palestra',
    data_hora_inicio DATETIME NOT NULL,
    data_hora_fim DATETIME NOT NULL,
    local VARCHAR(100) NOT NULL,
    limite_vagas INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_atividade_evento
        FOREIGN KEY (id_evento)
        REFERENCES evento(id_evento)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_atividade_vagas
        CHECK (limite_vagas > 0),

    CONSTRAINT chk_atividade_datas
        CHECK (data_hora_inicio < data_hora_fim)
) ENGINE=InnoDB;

-- 4. Tabela INSCRICAO
CREATE TABLE IF NOT EXISTS inscricao (
    id_inscricao INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_atividade INT NOT NULL,
    data_inscricao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('CONFIRMADA', 'CANCELADA')
        NOT NULL DEFAULT 'CONFIRMADA',

    -- Impede o mesmo usuário de se inscrever duas vezes na mesma atividade
    CONSTRAINT uk_usuario_atividade
        UNIQUE (id_usuario, id_atividade),

    CONSTRAINT fk_inscricao_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_inscricao_atividade
        FOREIGN KEY (id_atividade)
        REFERENCES atividade(id_atividade)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 5. Tabela FREQUENCIA
CREATE TABLE IF NOT EXISTS frequencia (
    id_frequencia INT AUTO_INCREMENT PRIMARY KEY,
    id_inscricao INT NOT NULL UNIQUE,
    presente BOOLEAN NOT NULL DEFAULT FALSE,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_frequencia_inscricao
        FOREIGN KEY (id_inscricao)
        REFERENCES inscricao(id_inscricao)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 6. Tabela CERTIFICADO
CREATE TABLE IF NOT EXISTS certificado (
    id_certificado INT AUTO_INCREMENT PRIMARY KEY,
    id_frequencia INT NOT NULL UNIQUE,
    codigo_validacao VARCHAR(64) NOT NULL UNIQUE,
    data_emissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_certificado_frequencia
        FOREIGN KEY (id_frequencia)
        REFERENCES frequencia(id_frequencia)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;
