CREATE TABLE `accounts` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`type` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`provider_account_id` varchar(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` int,
	`token_type` varchar(255),
	`scope` varchar(255),
	`id_token` text,
	`session_state` varchar(255),
	CONSTRAINT `accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` varchar(36) NOT NULL,
	`order_id` varchar(36) NOT NULL,
	`sender_id` varchar(36) NOT NULL,
	`content` text NOT NULL,
	`file_url` varchar(500),
	`file_type` enum('IMAGE','VIDEO','PDF','OTHER'),
	`file_name` varchar(255),
	`is_read` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`service_id` varchar(36) NOT NULL,
	`status` enum('PENDING','CONFIRMED','IN_PROGRESS','REVIEW','DELIVERED','CANCELLED') NOT NULL DEFAULT 'PENDING',
	`total_price` decimal(10,2) NOT NULL,
	`notes` text,
	`payment_method` varchar(100),
	`payment_status` enum('PENDING','PAID','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
	`payment_intent_id` varchar(255),
	`deliverable_url` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `portfolio` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(100) NOT NULL,
	`before_url` varchar(500) NOT NULL,
	`after_url` varchar(500) NOT NULL,
	`type` enum('IMAGE','VIDEO') NOT NULL DEFAULT 'IMAGE',
	`is_featured` boolean NOT NULL DEFAULT false,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `portfolio_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` varchar(36) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`short_description` varchar(500),
	`price` decimal(10,2) NOT NULL,
	`category` varchar(100) NOT NULL,
	`delivery_days` int NOT NULL DEFAULT 3,
	`thumbnail_url` varchar(500),
	`features` text,
	`not_included` text,
	`tags` varchar(500),
	`is_active` boolean NOT NULL DEFAULT true,
	`is_featured` boolean NOT NULL DEFAULT false,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `services_id` PRIMARY KEY(`id`),
	CONSTRAINT `services_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`session_token` varchar(255) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `sessions_session_token` PRIMARY KEY(`session_token`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255),
	`role` enum('ADMIN','CLIENT') NOT NULL DEFAULT 'CLIENT',
	`image` varchar(500),
	`email_verified` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE INDEX `account_user_id_idx` ON `accounts` (`user_id`);--> statement-breakpoint
CREATE INDEX `message_order_id_idx` ON `messages` (`order_id`);--> statement-breakpoint
CREATE INDEX `message_sender_id_idx` ON `messages` (`sender_id`);--> statement-breakpoint
CREATE INDEX `message_is_read_idx` ON `messages` (`is_read`);--> statement-breakpoint
CREATE INDEX `order_user_id_idx` ON `orders` (`user_id`);--> statement-breakpoint
CREATE INDEX `order_status_idx` ON `orders` (`status`);--> statement-breakpoint
CREATE INDEX `order_payment_status_idx` ON `orders` (`payment_status`);--> statement-breakpoint
CREATE INDEX `portfolio_category_idx` ON `portfolio` (`category`);--> statement-breakpoint
CREATE INDEX `portfolio_featured_idx` ON `portfolio` (`is_featured`);--> statement-breakpoint
CREATE INDEX `service_slug_idx` ON `services` (`slug`);--> statement-breakpoint
CREATE INDEX `service_category_idx` ON `services` (`category`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users` (`email`);