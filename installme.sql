CREATE DATABASE modmail CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;

USE modmail;

CREATE TABLE mail(
    id BIGINT AUTO_INCREMENT,
    createdBy TEXT,
    createdOn TEXT,
    channel TEXT,
    webhook TEXT,
    active BOOLEAN DEFAULT 1,
PRIMARY KEY (id));

CREATE TABLE users(
    id BIGINT AUTO_INCREMENT,
    username TEXT,
    userid TEXT,
    logo TEXT,
PRIMARY KEY (id));

CREATE TABLE messages(
    id BIGINT AUTO_INCREMENT,
    text TEXT,
    image TEXT,
    user TEXT,
    mail BIGINT,
PRIMARY KEY (id));