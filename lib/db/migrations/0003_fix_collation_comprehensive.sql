
-- Comprehensive fix for collation mismatch
-- Target: utf8mb4_0900_ai_ci

-- 1. Alter Database
ALTER DATABASE `pdledits` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- 2. Alter Tables
ALTER TABLE `users` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
ALTER TABLE `accounts` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
ALTER TABLE `sessions` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
ALTER TABLE `services` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
ALTER TABLE `portfolio` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
ALTER TABLE `orders` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
ALTER TABLE `messages` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- 3. Verify (Optional for manual check)
-- SELECT table_name, table_collation FROM information_schema.tables WHERE table_schema = 'pdledits';
