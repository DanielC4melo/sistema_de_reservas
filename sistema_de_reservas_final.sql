-- 1. Desativar travas de segurança
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_SAFE_UPDATES = 0;

-- 2. Limpar as tabelas que EXISTEM (Resetar dados e contagem de IDs)
TRUNCATE TABLE RESERVA;
TRUNCATE TABLE EQUIPAMENTO;
TRUNCATE TABLE SALA;
TRUNCATE TABLE PROFESSOR;
TRUNCATE TABLE COORDENACAO;

-- 3. Reativar as chaves
SET FOREIGN_KEY_CHECKS = 1;
SET SQL_SAFE_UPDATES = 1;

-- ====================================================
-- AGORA INSERIMOS OS DADOS LIMPOS (IDs começarão do 1)
-- ====================================================

INSERT INTO PROFESSOR (nomeProfessor, emailProfessor, senhaProfessor, matriculaProfessor) VALUES
('Fabrício', 'fabricio@unirio.br', 'senha123', 'P001'), -- ID 1
('Morgana', 'morgana@unirio.br', 'senha123', 'P002'), -- ID 2
('Geiza', 'geiza@unirio.br', 'senha123', 'P003'),    -- ID 3
('Jefferson', 'jefferson@unirio.br', 'senha123', 'P004'), -- ID 4
('Laura', 'laura@unirio.br', 'senha123', 'P005');    -- ID 5

INSERT INTO COORDENACAO (nomeCoordenacao, emailCoordenacao, senhaCoordenacao) VALUES
('Coordenação', 'coordenacao@unirio.br', 'senha123'); -- ID 1

INSERT INTO SALA (nomeSala, capacidadeSala) VALUES
('Laboratório 1', 25), -- ID 1
('Laboratório 2', 25), -- ID 2
('Laboratório 3', 25), -- ID 3
('Sala 212', 30),      -- ID 4
('Sala 215', 30);      -- ID 5

INSERT INTO EQUIPAMENTO (nomeEquipamento, quantidadeEquipamento) VALUES
('Projetor Epson', 5),  -- ID 1
('Notebook Dell', 10);  -- ID 2

-- Reservas criadas por Professores
INSERT INTO RESERVA (data, fk_IdSala, fk_IdProfessor, fk_IdEquipamento, criadaPor) VALUES
('2025-10-21 09:00:00', 1, 1, 1, 'PROFESSOR'),
('2025-10-21 14:00:00', 2, 2, 2, 'PROFESSOR');

-- Reserva criada pela Coordenação
INSERT INTO RESERVA (data, fk_IdSala, fk_IdProfessor, fk_IdEquipamento, fk_IdCoordenacao, criadaPor) VALUES
('2025-10-22 10:00:00', 3, 3, 2, 1, 'COORDENACAO');