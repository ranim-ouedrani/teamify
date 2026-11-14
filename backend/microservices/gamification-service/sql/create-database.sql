-- Script de création de la base du microservice gamification.
-- Remplacer CHANGE_ME par un mot de passe fort (ne jamais le committer dans Git).

CREATE DATABASE IF NOT EXISTS gamification_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY '';

GRANT ALL PRIVILEGES ON gamification_db.* TO 'root'@'localhost';

FLUSH PRIVILEGES;
