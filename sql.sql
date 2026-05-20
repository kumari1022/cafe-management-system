-- ============================================================
-- Cafe Management System - Complete Database Schema
-- Schema: cafesystem
-- Updated to include all tables for the full Customer module
-- ============================================================

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE SCHEMA IF NOT EXISTS `cafesystem` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `cafesystem`;

-- -----------------------------------------------------------
-- Table: user
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cafesystem`.`user` (
  `id`             INT          NOT NULL AUTO_INCREMENT,
  `contact_number` VARCHAR(255) NULL DEFAULT NULL,
  `email`          VARCHAR(255) NULL DEFAULT NULL,
  `name`           VARCHAR(255) NULL DEFAULT NULL,
  `password`       VARCHAR(255) NULL DEFAULT NULL,
  `role`           VARCHAR(255) NULL DEFAULT NULL,
  `status`         VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------------
-- Table: category
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cafesystem`.`category` (
  `id`   INT          NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------------
-- Table: product
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cafesystem`.`product` (
  `id`          INT          NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(255) NULL DEFAULT NULL,
  `description` VARCHAR(255) NULL DEFAULT NULL,
  `price`       INT          NULL DEFAULT NULL,
  `status`      VARCHAR(255) NULL DEFAULT NULL,
  `image_url`   VARCHAR(500) NULL DEFAULT NULL,
  `category_fk` INT          NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FK_product_category` (`category_fk` ASC),
  CONSTRAINT `FK_product_category`
    FOREIGN KEY (`category_fk`)
    REFERENCES `cafesystem`.`category` (`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------------
-- Table: bill
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cafesystem`.`bill` (
  `id`            INT          NOT NULL AUTO_INCREMENT,
  `contactnumber` VARCHAR(255) NULL DEFAULT NULL,
  `createdby`     VARCHAR(255) NULL DEFAULT NULL,
  `email`         VARCHAR(255) NULL DEFAULT NULL,
  `name`          VARCHAR(255) NULL DEFAULT NULL,
  `paymentmethod` VARCHAR(255) NULL DEFAULT NULL,
  `productdetails` JSON        NULL DEFAULT NULL,
  `total`         INT          NULL DEFAULT NULL,
  `uuid`          VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------------
-- Table: cafe_order  (customer orders)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cafesystem`.`cafe_order` (
  `id`           INT          NOT NULL AUTO_INCREMENT,
  `user_fk`      INT          NOT NULL,
  `total_amount` INT          NULL DEFAULT NULL,
  `order_status` VARCHAR(255) NULL DEFAULT 'pending',
  `created_at`   DATETIME     NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `FK_order_user` (`user_fk` ASC),
  CONSTRAINT `FK_order_user`
    FOREIGN KEY (`user_fk`)
    REFERENCES `cafesystem`.`user` (`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------------
-- Table: order_item
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cafesystem`.`order_item` (
  `id`          INT NOT NULL AUTO_INCREMENT,
  `order_fk`    INT NOT NULL,
  `product_fk`  INT NOT NULL,
  `quantity`    INT NULL DEFAULT NULL,
  `price`       INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `FK_item_order` (`order_fk` ASC),
  INDEX `FK_item_product` (`product_fk` ASC),
  CONSTRAINT `FK_item_order`
    FOREIGN KEY (`order_fk`)
    REFERENCES `cafesystem`.`cafe_order` (`id`),
  CONSTRAINT `FK_item_product`
    FOREIGN KEY (`product_fk`)
    REFERENCES `cafesystem`.`product` (`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------------
-- Table: review
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cafesystem`.`review` (
  `id`          INT           NOT NULL AUTO_INCREMENT,
  `user_fk`     INT           NOT NULL,
  `product_fk`  INT           NOT NULL,
  `rating`      INT           NULL DEFAULT NULL,
  `comment`     VARCHAR(1000) NULL DEFAULT NULL,
  `created_at`  DATETIME      NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `FK_review_user` (`user_fk` ASC),
  INDEX `FK_review_product` (`product_fk` ASC),
  CONSTRAINT `FK_review_user`
    FOREIGN KEY (`user_fk`)
    REFERENCES `cafesystem`.`user` (`id`),
  CONSTRAINT `FK_review_product`
    FOREIGN KEY (`product_fk`)
    REFERENCES `cafesystem`.`product` (`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------------
-- Table: hibernate_sequence (legacy ID generator if used)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cafesystem`.`hibernate_sequence` (
  `next_val` BIGINT NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------------
-- NOTE: Spring Boot with ddl-auto=update will auto-create/
-- alter these tables on first run. Use this script only
-- for fresh DB setup or reference.
-- -----------------------------------------------------------

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
