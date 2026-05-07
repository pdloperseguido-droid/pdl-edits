-- ============================================================
-- Migração: Correção de Collation
-- Erro: Illegal mix of collations (utf8mb4_general_ci,IMPLICIT)
--       and (utf8mb4_0900_ai_ci,IMPLICIT) for operation '='
-- Execute este SQL no HeidiSQL antes de reiniciar o servidor
-- ============================================================

-- Padroniza collation das tabelas principais para utf8mb4_0900_ai_ci

ALTER TABLE `users`
  CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

ALTER TABLE `orders`
  CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

ALTER TABLE `services`
  CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

ALTER TABLE `accounts`
  CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

ALTER TABLE `sessions`
  CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

ALTER TABLE `messages`
  CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

ALTER TABLE `portfolio`
  CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
