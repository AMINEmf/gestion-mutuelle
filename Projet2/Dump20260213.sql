CREATE DATABASE  IF NOT EXISTS `gestion_bee` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `gestion_bee`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: gestion_bee
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `absence_previsionnels`
--

DROP TABLE IF EXISTS `absence_previsionnels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `absence_previsionnels` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `absence` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_depart` date NOT NULL,
  `heure_depart` time NOT NULL,
  `date_reprise` date NOT NULL,
  `heure_reprise` time NOT NULL,
  `employee_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `absence_previsionnels_employee_id_foreign` (`employee_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `absence_previsionnels`
--

LOCK TABLES `absence_previsionnels` WRITE;
/*!40000 ALTER TABLE `absence_previsionnels` DISABLE KEYS */;
/*!40000 ALTER TABLE `absence_previsionnels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `affiliations_mutuelle`
--

DROP TABLE IF EXISTS `affiliations_mutuelle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `affiliations_mutuelle` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employe_id` bigint unsigned NOT NULL,
  `mutuelle_id` bigint unsigned NOT NULL,
  `regime_mutuelle_id` bigint unsigned NOT NULL,
  `numero_adherent` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_adhesion` date NOT NULL,
  `date_resiliation` date DEFAULT NULL,
  `ayant_droit` tinyint(1) NOT NULL DEFAULT '0',
  `conjoint_ayant_droit` tinyint(1) NOT NULL DEFAULT '0',
  `statut` enum('ACTIVE','RESILIE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `commentaire` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `affiliations_mutuelle_regime_mutuelle_id_foreign` (`regime_mutuelle_id`),
  KEY `affiliations_mutuelle_employe_id_statut_index` (`employe_id`,`statut`),
  KEY `affiliations_mutuelle_mutuelle_id_statut_index` (`mutuelle_id`,`statut`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `affiliations_mutuelle`
--

LOCK TABLES `affiliations_mutuelle` WRITE;
/*!40000 ALTER TABLE `affiliations_mutuelle` DISABLE KEYS */;
INSERT INTO `affiliations_mutuelle` VALUES (1,5,1,1,NULL,'2026-02-07','2026-02-07',0,0,'RESILIE','Résiliation de masse via interface web','2026-02-07 19:25:55','2026-02-07 19:26:05'),(2,5,4,6,'11111','2026-02-07',NULL,0,0,'ACTIVE',NULL,'2026-02-07 19:26:50','2026-02-07 19:26:50');
/*!40000 ALTER TABLE `affiliations_mutuelle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `agents`
--

DROP TABLE IF EXISTS `agents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `NomAgent` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `PrenomAgent` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SexeAgent` enum('Masculin','Feminin') COLLATE utf8mb4_unicode_ci NOT NULL,
  `EmailAgent` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TelAgent` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `AdresseAgent` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `VilleAgent` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `CodePostalAgent` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `agents_emailagent_unique` (`EmailAgent`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agents`
--

LOCK TABLES `agents` WRITE;
/*!40000 ALTER TABLE `agents` DISABLE KEYS */;
/*!40000 ALTER TABLE `agents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `arrondis`
--

DROP TABLE IF EXISTS `arrondis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `arrondis` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `min` double(8,2) NOT NULL,
  `max` double(8,2) NOT NULL,
  `valeur_arrondi` double(8,2) NOT NULL,
  `type_arrondi` enum('Ajouter','Détruire') COLLATE utf8mb4_unicode_ci NOT NULL,
  `groupe_arrondi_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `arrondis_groupe_arrondi_id_foreign` (`groupe_arrondi_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arrondis`
--

LOCK TABLES `arrondis` WRITE;
/*!40000 ALTER TABLE `arrondis` DISABLE KEYS */;
/*!40000 ALTER TABLE `arrondis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `autorisations`
--

DROP TABLE IF EXISTS `autorisations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `autorisations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `autorisation_onas` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_autorisation` date NOT NULL,
  `date_expiration` date NOT NULL,
  `date_alerte` date DEFAULT NULL,
  `vehicule_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `autorisations_vehicule_id_foreign` (`vehicule_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `autorisations`
--

LOCK TABLES `autorisations` WRITE;
/*!40000 ALTER TABLE `autorisations` DISABLE KEYS */;
/*!40000 ALTER TABLE `autorisations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bon__entres`
--

DROP TABLE IF EXISTS `bon__entres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bon__entres` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `reference` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `emetteur` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recepteur` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bon__entres`
--

LOCK TABLES `bon__entres` WRITE;
/*!40000 ALTER TABLE `bon__entres` DISABLE KEYS */;
/*!40000 ALTER TABLE `bon__entres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bon__sourties`
--

DROP TABLE IF EXISTS `bon__sourties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bon__sourties` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `reference` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `emetteur` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recepteur` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bon__sourties`
--

LOCK TABLES `bon__sourties` WRITE;
/*!40000 ALTER TABLE `bon__sourties` DISABLE KEYS */;
/*!40000 ALTER TABLE `bon__sourties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bon_livraisons`
--

DROP TABLE IF EXISTS `bon_livraisons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bon_livraisons` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `reference` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `validation_offer` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `modePaiement` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bon_livraisons_client_id_foreign` (`client_id`),
  KEY `bon_livraisons_user_id_foreign` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bon_livraisons`
--

LOCK TABLES `bon_livraisons` WRITE;
/*!40000 ALTER TABLE `bon_livraisons` DISABLE KEYS */;
/*!40000 ALTER TABLE `bon_livraisons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calculs`
--

DROP TABLE IF EXISTS `calculs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calculs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `rubrique_id` bigint unsigned NOT NULL,
  `type_calcul` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gain` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `formule` text COLLATE utf8mb4_unicode_ci,
  `formule_nombre` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `formule_base` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `formule_taux` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `formule_montant` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `report_nombre` tinyint(1) NOT NULL DEFAULT '0',
  `report_base` tinyint(1) NOT NULL DEFAULT '0',
  `report_taux` tinyint(1) NOT NULL DEFAULT '0',
  `report_montant` tinyint(1) NOT NULL DEFAULT '0',
  `impression_nombre` tinyint(1) NOT NULL DEFAULT '0',
  `impression_base` tinyint(1) NOT NULL DEFAULT '0',
  `impression_taux` tinyint(1) NOT NULL DEFAULT '0',
  `impression_montant` tinyint(1) NOT NULL DEFAULT '0',
  `saisie_nombre` tinyint(1) NOT NULL DEFAULT '0',
  `saisie_base` tinyint(1) NOT NULL DEFAULT '0',
  `saisie_taux` tinyint(1) NOT NULL DEFAULT '0',
  `saisie_montant` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `calculs_rubrique_id_index` (`rubrique_id`),
  KEY `calculs_type_calcul_index` (`type_calcul`),
  KEY `calculs_gain_index` (`gain`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calculs`
--

LOCK TABLES `calculs` WRITE;
/*!40000 ALTER TABLE `calculs` DISABLE KEYS */;
/*!40000 ALTER TABLE `calculs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calendries`
--

DROP TABLE IF EXISTS `calendries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calendries` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calendries`
--

LOCK TABLES `calendries` WRITE;
/*!40000 ALTER TABLE `calendries` DISABLE KEYS */;
/*!40000 ALTER TABLE `calendries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calibre`
--

DROP TABLE IF EXISTS `calibre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calibre` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `calibre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calibre`
--

LOCK TABLES `calibre` WRITE;
/*!40000 ALTER TABLE `calibre` DISABLE KEYS */;
/*!40000 ALTER TABLE `calibre` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `logoP` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categorie` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chargement_commandes`
--

DROP TABLE IF EXISTS `chargement_commandes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chargement_commandes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `vehicule_id` bigint unsigned NOT NULL,
  `conforme` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `statusChargemant` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remarque` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `livreur_id` bigint unsigned NOT NULL,
  `commande_id` bigint unsigned NOT NULL,
  `dateLivraisonPrevue` date NOT NULL,
  `dateLivraisonReelle` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `chargement_commandes_vehicule_id_foreign` (`vehicule_id`),
  KEY `chargement_commandes_livreur_id_foreign` (`livreur_id`),
  KEY `chargement_commandes_commande_id_foreign` (`commande_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chargement_commandes`
--

LOCK TABLES `chargement_commandes` WRITE;
/*!40000 ALTER TABLE `chargement_commandes` DISABLE KEYS */;
/*!40000 ALTER TABLE `chargement_commandes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chiffre_affaires`
--

DROP TABLE IF EXISTS `chiffre_affaires`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chiffre_affaires` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `client_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `chiffre_affaires_client_id_foreign` (`client_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chiffre_affaires`
--

LOCK TABLES `chiffre_affaires` WRITE;
/*!40000 ALTER TABLE `chiffre_affaires` DISABLE KEYS */;
/*!40000 ALTER TABLE `chiffre_affaires` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client_groupe_client`
--

DROP TABLE IF EXISTS `client_groupe_client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_groupe_client` (
  `CodeClient` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Id_groupe` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`CodeClient`,`Id_groupe`),
  KEY `client_groupe_client_id_groupe_foreign` (`Id_groupe`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_groupe_client`
--

LOCK TABLES `client_groupe_client` WRITE;
/*!40000 ALTER TABLE `client_groupe_client` DISABLE KEYS */;
/*!40000 ALTER TABLE `client_groupe_client` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `CodeClient` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `raison_sociale` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adresse` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_client` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categorie` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tele` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ville` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jour` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abreviation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code_postal` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logoC` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ice` int NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `zone_id` bigint unsigned NOT NULL,
  `region_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clients_codeclient_unique` (`CodeClient`),
  KEY `clients_user_id_foreign` (`user_id`),
  KEY `clients_zone_id_foreign` (`zone_id`),
  KEY `clients_region_id_foreign` (`region_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commandes`
--

DROP TABLE IF EXISTS `commandes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `commandes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `dateSaisis` timestamp NOT NULL,
  `dateCommande` date NOT NULL,
  `datePreparationCommande` date DEFAULT NULL,
  `reference` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mode_payement` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client_id` bigint unsigned DEFAULT NULL,
  `site_id` bigint unsigned DEFAULT NULL,
  `fournisseur_id` bigint unsigned DEFAULT NULL,
  `user_id` bigint unsigned NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `commandes_client_id_foreign` (`client_id`),
  KEY `commandes_site_id_foreign` (`site_id`),
  KEY `commandes_fournisseur_id_foreign` (`fournisseur_id`),
  KEY `commandes_user_id_foreign` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commandes`
--

LOCK TABLES `commandes` WRITE;
/*!40000 ALTER TABLE `commandes` DISABLE KEYS */;
/*!40000 ALTER TABLE `commandes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comptes`
--

DROP TABLE IF EXISTS `comptes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comptes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designations` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_compte` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `devise` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rib` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `swift` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adresse` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remarque` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comptes`
--

LOCK TABLES `comptes` WRITE;
/*!40000 ALTER TABLE `comptes` DISABLE KEYS */;
/*!40000 ALTER TABLE `comptes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `constantes`
--

DROP TABLE IF EXISTS `constantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `constantes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_constante` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `memo` text COLLATE utf8mb4_unicode_ci,
  `valeur` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `visibilite` tinyint(1) NOT NULL DEFAULT '1',
  `group_constante_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `constantes_group_constante_id_foreign` (`group_constante_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `constantes`
--

LOCK TABLES `constantes` WRITE;
/*!40000 ALTER TABLE `constantes` DISABLE KEYS */;
/*!40000 ALTER TABLE `constantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_clients`
--

DROP TABLE IF EXISTS `contact_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_clients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `idClient` bigint unsigned NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telephone` int NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contact_clients_idclient_foreign` (`idClient`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_clients`
--

LOCK TABLES `contact_clients` WRITE;
/*!40000 ALTER TABLE `contact_clients` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact_clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contract_types`
--

DROP TABLE IF EXISTS `contract_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contract_types` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `contract_types_name_unique` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contract_types`
--

LOCK TABLES `contract_types` WRITE;
/*!40000 ALTER TABLE `contract_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `contract_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contrats`
--

DROP TABLE IF EXISTS `contrats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contrats` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employe_id` bigint unsigned NOT NULL,
  `numero_contrat` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_contrat` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `arret_prevu` date DEFAULT NULL,
  `duree_prevu` int DEFAULT NULL,
  `design` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `debut_le` date DEFAULT NULL,
  `arret_effectif` date DEFAULT NULL,
  `duree_effective` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `motif_depart` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dernier_jour_travaille` date DEFAULT NULL,
  `notification_rupture` date DEFAULT NULL,
  `engagement_procedure` date DEFAULT NULL,
  `signature_rupture_conventionnelle` date DEFAULT NULL,
  `transaction_en_cours` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contrats_employe_id_foreign` (`employe_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contrats`
--

LOCK TABLES `contrats` WRITE;
/*!40000 ALTER TABLE `contrats` DISABLE KEYS */;
/*!40000 ALTER TABLE `contrats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departements`
--

DROP TABLE IF EXISTS `departements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departements` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `departements_parent_id_foreign` (`parent_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departements`
--

LOCK TABLES `departements` WRITE;
/*!40000 ALTER TABLE `departements` DISABLE KEYS */;
INSERT INTO `departements` VALUES (1,'INFO',NULL,NULL,NULL),(2,'Test',1,'2026-02-07 21:42:29','2026-02-07 21:42:29');
/*!40000 ALTER TABLE `departements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detail_motif_absences`
--

DROP TABLE IF EXISTS `detail_motif_absences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detail_motif_absences` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `group_motif_absence_id` bigint unsigned DEFAULT NULL,
  `designation` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abreviation` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('payé','non payé') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'payé',
  `cause` enum('congé','maladie') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'congé',
  `commentaire` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `detail_motif_absences_group_motif_absence_id_foreign` (`group_motif_absence_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detail_motif_absences`
--

LOCK TABLES `detail_motif_absences` WRITE;
/*!40000 ALTER TABLE `detail_motif_absences` DISABLE KEYS */;
/*!40000 ALTER TABLE `detail_motif_absences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `details_calendries`
--

DROP TABLE IF EXISTS `details_calendries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `details_calendries` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `debut` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fin` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `groupe_id` bigint unsigned NOT NULL,
  `groupe_horaire_id` bigint unsigned NOT NULL,
  `jourDebut` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `details_calendries_groupe_id_foreign` (`groupe_id`),
  KEY `details_calendries_groupe_horaire_id_foreign` (`groupe_horaire_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `details_calendries`
--

LOCK TABLES `details_calendries` WRITE;
/*!40000 ALTER TABLE `details_calendries` DISABLE KEYS */;
/*!40000 ALTER TABLE `details_calendries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `details_periodiques`
--

DROP TABLE IF EXISTS `details_periodiques`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `details_periodiques` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `numero_jour` int DEFAULT NULL,
  `libele` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `horaire` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `groupe_horaire_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `details_periodiques_groupe_horaire_id_foreign` (`groupe_horaire_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `details_periodiques`
--

LOCK TABLES `details_periodiques` WRITE;
/*!40000 ALTER TABLE `details_periodiques` DISABLE KEYS */;
/*!40000 ALTER TABLE `details_periodiques` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `details_regles`
--

DROP TABLE IF EXISTS `details_regles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `details_regles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `heures_supplementaires` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `supplement` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `autre_supplement` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plafond` decimal(10,2) NOT NULL,
  `numero_ordre` int NOT NULL,
  `regle_compensation_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `details_regles_regle_compensation_id_foreign` (`regle_compensation_id`),
  CONSTRAINT `details_regles_regle_compensation_id_foreign` FOREIGN KEY (`regle_compensation_id`) REFERENCES `regle_compensation` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `details_regles`
--

LOCK TABLES `details_regles` WRITE;
/*!40000 ALTER TABLE `details_regles` DISABLE KEYS */;
/*!40000 ALTER TABLE `details_regles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `devis`
--

DROP TABLE IF EXISTS `devis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `devis` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `reference` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `validation_offer` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `modePaiement` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `devis_client_id_foreign` (`client_id`),
  KEY `devis_user_id_foreign` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devis`
--

LOCK TABLES `devis` WRITE;
/*!40000 ALTER TABLE `devis` DISABLE KEYS */;
/*!40000 ALTER TABLE `devis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employe_departement`
--

DROP TABLE IF EXISTS `employe_departement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employe_departement` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employe_id` bigint unsigned NOT NULL,
  `departement_id` bigint unsigned NOT NULL,
  `date_début` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `employe_departement_employe_id_foreign` (`employe_id`),
  KEY `employe_departement_departement_id_foreign` (`departement_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employe_departement`
--

LOCK TABLES `employe_departement` WRITE;
/*!40000 ALTER TABLE `employe_departement` DISABLE KEYS */;
INSERT INTO `employe_departement` VALUES (1,6,2,'2026-02-09',NULL,'2026-02-09 10:08:54','2026-02-09 10:08:54');
/*!40000 ALTER TABLE `employe_departement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_histories`
--

DROP TABLE IF EXISTS `employee_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_histories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `matricule` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `departement_id` bigint unsigned DEFAULT NULL,
  `departement_nom` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employe_id` bigint unsigned NOT NULL,
  `date_début` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL,
  `action` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `employee_histories_departement_id_index` (`departement_id`),
  KEY `employee_histories_employe_id_index` (`employe_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_histories`
--

LOCK TABLES `employee_histories` WRITE;
/*!40000 ALTER TABLE `employee_histories` DISABLE KEYS */;
INSERT INTO `employee_histories` VALUES (1,'362','Echate','Karima',2,'Test',6,'2026-02-09',NULL,'nouvelle entrée','2026-02-09 10:08:54','2026-02-09 10:08:54');
/*!40000 ALTER TABLE `employee_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employes`
--

DROP TABLE IF EXISTS `employes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `matricule` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `num_badge` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prenom` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lieu_naiss` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_naiss` date DEFAULT NULL,
  `cin` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cnss` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sexe` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `situation_fm` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nb_enfants` int DEFAULT NULL,
  `adresse` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ville` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pays` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code_postal` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tel` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fax` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(35) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fonction` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nationalite` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `niveau` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `echelon` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categorie` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coeficients` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imputation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_entree` date DEFAULT NULL,
  `date_embauche` date DEFAULT NULL,
  `date_sortie` date DEFAULT NULL,
  `salaire_base` decimal(10,2) DEFAULT NULL,
  `remarque` text COLLATE utf8mb4_unicode_ci,
  `url_img` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `centreCout` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `departement_id` int DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `delivree_par` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_expiration` date DEFAULT NULL,
  `carte_sejour` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `motif_depart` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dernier_jour_travaille` date DEFAULT NULL,
  `notification_rupture` date DEFAULT NULL,
  `engagement_procedure` date DEFAULT NULL,
  `signature_rupture_conventionnelle` date DEFAULT NULL,
  `transaction_en_cours` tinyint(1) DEFAULT NULL,
  `bulletin_modele` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `salaire_moyen` decimal(10,2) DEFAULT NULL,
  `salaire_reference_annuel` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employes`
--

LOCK TABLES `employes` WRITE;
/*!40000 ALTER TABLE `employes` DISABLE KEYS */;
INSERT INTO `employes` VALUES (6,'362',NULL,'Echate','Karima',NULL,NULL,NULL,NULL,'female','married',2,NULL,NULL,NULL,NULL,NULL,NULL,'echate@gmail.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1,'2026-02-09 10:08:54','2026-02-09 10:08:54',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,NULL,NULL,'Lourini','Hiba',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,'0657812401',NULL,'hibalourini1@gmail.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1,'2026-02-07 19:08:08','2026-02-07 19:08:08',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,'1111111A',NULL,'Lourini','Hiba',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,'0657812401',NULL,'hibalourini1@gmail.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1,'2026-02-07 19:09:01','2026-02-07 19:09:01',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `employes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `encaissements`
--

DROP TABLE IF EXISTS `encaissements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `encaissements` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `referencee` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_encaissement` date NOT NULL,
  `montant_total` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comptes_id` bigint unsigned NOT NULL,
  `type_encaissement` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `encaissements_comptes_id_foreign` (`comptes_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `encaissements`
--

LOCK TABLES `encaissements` WRITE;
/*!40000 ALTER TABLE `encaissements` DISABLE KEYS */;
/*!40000 ALTER TABLE `encaissements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entrer_comptes`
--

DROP TABLE IF EXISTS `entrer_comptes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entrer_comptes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `client_id` bigint unsigned NOT NULL,
  `numero_cheque` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `datee` date NOT NULL,
  `mode_de_paiement` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remarque` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `entrer_comptes_client_id_foreign` (`client_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entrer_comptes`
--

LOCK TABLES `entrer_comptes` WRITE;
/*!40000 ALTER TABLE `entrer_comptes` DISABLE KEYS */;
/*!40000 ALTER TABLE `entrer_comptes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `etat_recouvrements`
--

DROP TABLE IF EXISTS `etat_recouvrements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `etat_recouvrements` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `client_id` bigint unsigned NOT NULL,
  `id_facture` bigint unsigned NOT NULL,
  `entrer_comptes_id` bigint unsigned NOT NULL,
  `reste` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `etat_recouvrements_client_id_foreign` (`client_id`),
  KEY `etat_recouvrements_id_facture_foreign` (`id_facture`),
  KEY `etat_recouvrements_entrer_comptes_id_foreign` (`entrer_comptes_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `etat_recouvrements`
--

LOCK TABLES `etat_recouvrements` WRITE;
/*!40000 ALTER TABLE `etat_recouvrements` DISABLE KEYS */;
/*!40000 ALTER TABLE `etat_recouvrements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `factures`
--

DROP TABLE IF EXISTS `factures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `factures` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `reference` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `ref_BL` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ref_BC` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modePaiement` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_ttc` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client_id` bigint unsigned NOT NULL,
  `id_devis` bigint unsigned DEFAULT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `factures_client_id_foreign` (`client_id`),
  KEY `factures_id_devis_foreign` (`id_devis`),
  KEY `factures_user_id_foreign` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `factures`
--

LOCK TABLES `factures` WRITE;
/*!40000 ALTER TABLE `factures` DISABLE KEYS */;
/*!40000 ALTER TABLE `factures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fournisseurs`
--

DROP TABLE IF EXISTS `fournisseurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fournisseurs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `CodeFournisseur` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `raison_sociale` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adresse` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tele` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ville` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abreviation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code_postal` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ice` bigint NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `fournisseurs_codefournisseur_unique` (`CodeFournisseur`),
  KEY `fournisseurs_user_id_foreign` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fournisseurs`
--

LOCK TABLES `fournisseurs` WRITE;
/*!40000 ALTER TABLE `fournisseurs` DISABLE KEYS */;
/*!40000 ALTER TABLE `fournisseurs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gp_agences`
--

DROP TABLE IF EXISTS `gp_agences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gp_agences` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `banque_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_agences_banque_id_foreign` (`banque_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gp_agences`
--

LOCK TABLES `gp_agences` WRITE;
/*!40000 ALTER TABLE `gp_agences` DISABLE KEYS */;
/*!40000 ALTER TABLE `gp_agences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gp_banques`
--

DROP TABLE IF EXISTS `gp_banques`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gp_banques` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gp_banques`
--

LOCK TABLES `gp_banques` WRITE;
/*!40000 ALTER TABLE `gp_banques` DISABLE KEYS */;
/*!40000 ALTER TABLE `gp_banques` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gp_bon_sortie`
--

DROP TABLE IF EXISTS `gp_bon_sortie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gp_bon_sortie` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `date_sortie` date DEFAULT NULL,
  `heure_sortie` time DEFAULT NULL,
  `duree_estimee` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `motif_sortie` text COLLATE utf8mb4_unicode_ci,
  `responsable_nom` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `responsable_poste` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_autorisation` date DEFAULT NULL,
  `heure_retour` time DEFAULT NULL,
  `date_retour` date DEFAULT NULL,
  `employee_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_bon_sortie_employee_id_foreign` (`employee_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gp_bon_sortie`
--

LOCK TABLES `gp_bon_sortie` WRITE;
/*!40000 ALTER TABLE `gp_bon_sortie` DISABLE KEYS */;
/*!40000 ALTER TABLE `gp_bon_sortie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gp_bultin_model_constante`
--

DROP TABLE IF EXISTS `gp_bultin_model_constante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gp_bultin_model_constante` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `bultin_model_id` bigint unsigned NOT NULL,
  `constante_id` bigint unsigned NOT NULL,
  `ordre` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_bultin_model_constante_bultin_model_id_foreign` (`bultin_model_id`),
  KEY `gp_bultin_model_constante_constante_id_foreign` (`constante_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gp_bultin_model_constante`
--

LOCK TABLES `gp_bultin_model_constante` WRITE;
/*!40000 ALTER TABLE `gp_bultin_model_constante` DISABLE KEYS */;
/*!40000 ALTER TABLE `gp_bultin_model_constante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gp_bultin_model_rubrique`
--

DROP TABLE IF EXISTS `gp_bultin_model_rubrique`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gp_bultin_model_rubrique` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `bultin_model_id` bigint unsigned NOT NULL,
  `rubrique_id` bigint unsigned NOT NULL,
  `ordre` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_bultin_model_rubrique_bultin_model_id_foreign` (`bultin_model_id`),
  KEY `gp_bultin_model_rubrique_rubrique_id_foreign` (`rubrique_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gp_bultin_model_rubrique`
--

LOCK TABLES `gp_bultin_model_rubrique` WRITE;
/*!40000 ALTER TABLE `gp_bultin_model_rubrique` DISABLE KEYS */;
/*!40000 ALTER TABLE `gp_bultin_model_rubrique` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gp_bultin_models`
--

DROP TABLE IF EXISTS `gp_bultin_models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gp_bultin_models` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `theme_bultin_model_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_bultin_models_theme_bultin_model_id_foreign` (`theme_bultin_model_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gp_bultin_models`
--

LOCK TABLES `gp_bultin_models` WRITE;
/*!40000 ALTER TABLE `gp_bultin_models` DISABLE KEYS */;
/*!40000 ALTER TABLE `gp_bultin_models` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gp_calendriers_employes`
--

DROP TABLE IF EXISTS `gp_calendriers_employes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gp_calendriers_employes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employe_id` bigint unsigned NOT NULL,
  `calendrier_id` bigint unsigned NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_calendriers_employes_employe_id_foreign` (`employe_id`),
  KEY `gp_calendriers_employes_calendrier_id_foreign` (`calendrier_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gp_calendriers_employes`
--

LOCK TABLES `gp_calendriers_employes` WRITE;
/*!40000 ALTER TABLE `gp_calendriers_employes` DISABLE KEYS */;
/*!40000 ALTER TABLE `gp_calendriers_employes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gp_communes`
--

DROP TABLE IF EXISTS `gp_communes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gp_communes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ville_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_communes_ville_id_foreign` (`ville_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gp_communes`
--

LOCK TABLES `gp_communes` WRITE;
/*!40000 ALTER TABLE `gp_communes` DISABLE KEYS */;
/*!40000 ALTER TABLE `gp_communes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gp_comptes_bancaires`
--

DROP TABLE IF EXISTS `gp_comptes_bancaires`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gp_comptes_bancaires` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employe_id` bigint unsigned NOT NULL,
  `agence_id` bigint unsigned DEFAULT NULL,
  `rib` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `iban` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_comptes_bancaires_employe_id_foreign` (`employe_id`),
  KEY `gp_comptes_bancaires_agence_id_foreign` (`agence_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gp_comptes_bancaires`
--

LOCK TABLES `gp_comptes_bancaires` WRITE;
/*!40000 ALTER TABLE `gp_comptes_bancaires` DISABLE KEYS */;
/*!40000 ALTER TABLE `gp_comptes_bancaires` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gp_conges`
--

DROP TABLE IF EXISTS `gp_conges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gp_conges` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employe_id` bigint unsigned NOT NULL,
  `jours_cumules` decimal(5,2) NOT NULL DEFAULT '0.00',
  `jours_consomes` decimal(5,2) NOT NULL DEFAULT '0.00',
  `solde_actuel` decimal(5,2) NOT NULL DEFAULT '0.00',
  `last_update` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_conges_employe_id_foreign` (`employe_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gp_conges`
--

LOCK TABLES `gp_conges` WRITE;
/*!40000 ALTER TABLE `gp_conges` DISABLE KEYS */;
/*!40000 ALTER TABLE `gp_conges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gp_demandes_conges`
--

DROP TABLE IF EXISTS `gp_demandes_conges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gp_demandes_conges` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employe_id` bigint unsigned NOT NULL,
  `type_conge` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `nombre_jours` int DEFAULT NULL,
  `motif` text COLLATE utf8mb4_unicode_ci,
  `piece_jointe` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statut` enum('en_attente','approuve','rejete') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en_attente',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_demandes_conges_employe_id_foreign` (`employe_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gp_demandes_conges`
--

LOCK TABLES `gp_demandes_conges` WRITE;
/*!40000 ALTER TABLE `gp_demandes_conges` DISABLE KEYS */;
/*!40000 ALTER TABLE `gp_demandes_conges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gp_employe_bulletins`
--

DROP TABLE IF EXISTS `gp_employe_bulletins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gp_employe_bulletins` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employe_id` bigint unsigned NOT NULL,
  `bulletin_modele_id` bigint unsigned NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_employe_bulletins_employe_id_foreign` (`employe_id`),
  KEY `gp_employe_bulletins_bulletin_modele_id_foreign` (`bulletin_modele_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gp_employe_bulletins`
--

LOCK TABLES `gp_employe_bulletins` WRITE;
/*!40000 ALTER TABLE `gp_employe_bulletins` DISABLE KEYS */;
/*!40000 ALTER TABLE `gp_employe_bulletins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gp_group_paie`
--

DROP TABLE IF EXISTS `gp_group_paie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gp_group_paie` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gp_group_paie`
--

LOCK TABLES `gp_group_paie` WRITE;
/*!40000 ALTER TABLE `gp_group_paie` DISABLE KEYS */;
/*!40000 ALTER TABLE `gp_group_paie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gp_paie_rubrique`
--

DROP TABLE IF EXISTS `gp_paie_rubrique`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gp_paie_rubrique` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `group_paie_id` bigint unsigned NOT NULL,
  `rubrique_id` bigint unsigned NOT NULL,
  `ordre` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_paie_rubrique_group_paie_id_foreign` (`group_paie_id`),
  KEY `gp_paie_rubrique_rubrique_id_foreign` (`rubrique_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gp_paie_rubrique`
--

LOCK TABLES `gp_paie_rubrique` WRITE;
/*!40000 ALTER TABLE `gp_paie_rubrique` DISABLE KEYS */;
/*!40000 ALTER TABLE `gp_paie_rubrique` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gp_pays`
--

DROP TABLE IF EXISTS `gp_pays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gp_pays` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code_pays` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gp_pays`
--

LOCK TABLES `gp_pays` WRITE;
/*!40000 ALTER TABLE `gp_pays` DISABLE KEYS */;
/*!40000 ALTER TABLE `gp_pays` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gp_postes`
--

DROP TABLE IF EXISTS `gp_postes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gp_postes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unite_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_postes_unite_id_foreign` (`unite_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gp_postes`
--

LOCK TABLES `gp_postes` WRITE;
/*!40000 ALTER TABLE `gp_postes` DISABLE KEYS */;
/*!40000 ALTER TABLE `gp_postes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gp_regle_employe`
--

DROP TABLE IF EXISTS `gp_regle_employe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gp_regle_employe` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employe_id` bigint unsigned NOT NULL,
  `regle_id` bigint unsigned NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_regle_employe_regle_id_foreign` (`regle_id`),
  KEY `gp_regle_employe_employe_id_regle_id_index` (`employe_id`,`regle_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gp_regle_employe`
--

LOCK TABLES `gp_regle_employe` WRITE;
/*!40000 ALTER TABLE `gp_regle_employe` DISABLE KEYS */;
/*!40000 ALTER TABLE `gp_regle_employe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gp_services`
--

DROP TABLE IF EXISTS `gp_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gp_services` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `departement_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_services_departement_id_foreign` (`departement_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gp_services`
--

LOCK TABLES `gp_services` WRITE;
/*!40000 ALTER TABLE `gp_services` DISABLE KEYS */;
/*!40000 ALTER TABLE `gp_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gp_societes`
--

DROP TABLE IF EXISTS `gp_societes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gp_societes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `RaisonSocial` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ICE` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `NumeroCNSS` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `NumeroFiscale` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `RegistreCommercial` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `AdresseSociete` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gp_societes`
--

LOCK TABLES `gp_societes` WRITE;
/*!40000 ALTER TABLE `gp_societes` DISABLE KEYS */;
/*!40000 ALTER TABLE `gp_societes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gp_theme_bultin_model`
--

DROP TABLE IF EXISTS `gp_theme_bultin_model`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gp_theme_bultin_model` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `theme_par_defaut` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gp_theme_bultin_model`
--

LOCK TABLES `gp_theme_bultin_model` WRITE;
/*!40000 ALTER TABLE `gp_theme_bultin_model` DISABLE KEYS */;
/*!40000 ALTER TABLE `gp_theme_bultin_model` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gp_unites`
--

DROP TABLE IF EXISTS `gp_unites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gp_unites` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `service_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_unites_service_id_foreign` (`service_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gp_unites`
--

LOCK TABLES `gp_unites` WRITE;
/*!40000 ALTER TABLE `gp_unites` DISABLE KEYS */;
/*!40000 ALTER TABLE `gp_unites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gp_villes`
--

DROP TABLE IF EXISTS `gp_villes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gp_villes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pays_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gp_villes_pays_id_foreign` (`pays_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gp_villes`
--

LOCK TABLES `gp_villes` WRITE;
/*!40000 ALTER TABLE `gp_villes` DISABLE KEYS */;
/*!40000 ALTER TABLE `gp_villes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_constantes`
--

DROP TABLE IF EXISTS `group_constantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_constantes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `group_constantes_parent_id_foreign` (`parent_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_constantes`
--

LOCK TABLES `group_constantes` WRITE;
/*!40000 ALTER TABLE `group_constantes` DISABLE KEYS */;
/*!40000 ALTER TABLE `group_constantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_motif_absences`
--

DROP TABLE IF EXISTS `group_motif_absences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_motif_absences` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_motif_absences`
--

LOCK TABLES `group_motif_absences` WRITE;
/*!40000 ALTER TABLE `group_motif_absences` DISABLE KEYS */;
/*!40000 ALTER TABLE `group_motif_absences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_rubriques`
--

DROP TABLE IF EXISTS `group_rubriques`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_rubriques` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_rubriques`
--

LOCK TABLES `group_rubriques` WRITE;
/*!40000 ALTER TABLE `group_rubriques` DISABLE KEYS */;
/*!40000 ALTER TABLE `group_rubriques` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groupe_arrondi`
--

DROP TABLE IF EXISTS `groupe_arrondi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groupe_arrondi` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `HT` tinyint(1) NOT NULL DEFAULT '0',
  `HN` tinyint(1) NOT NULL DEFAULT '0',
  `PR` tinyint(1) NOT NULL DEFAULT '0',
  `HS_0` tinyint(1) NOT NULL DEFAULT '0',
  `HS_25` tinyint(1) NOT NULL DEFAULT '0',
  `HS_50` tinyint(1) NOT NULL DEFAULT '0',
  `HS_100` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groupe_arrondi`
--

LOCK TABLES `groupe_arrondi` WRITE;
/*!40000 ALTER TABLE `groupe_arrondi` DISABLE KEYS */;
/*!40000 ALTER TABLE `groupe_arrondi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groupe_clients`
--

DROP TABLE IF EXISTS `groupe_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groupe_clients` (
  `Id_groupe` bigint unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Id_groupe`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groupe_clients`
--

LOCK TABLES `groupe_clients` WRITE;
/*!40000 ALTER TABLE `groupe_clients` DISABLE KEYS */;
/*!40000 ALTER TABLE `groupe_clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groupe_horaires`
--

DROP TABLE IF EXISTS `groupe_horaires`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groupe_horaires` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('fixe','automatique','flexible ouvrable') COLLATE utf8mb4_unicode_ci NOT NULL,
  `abreviation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `couleur` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groupe_horaires`
--

LOCK TABLES `groupe_horaires` WRITE;
/*!40000 ALTER TABLE `groupe_horaires` DISABLE KEYS */;
/*!40000 ALTER TABLE `groupe_horaires` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `heures_travail`
--

DROP TABLE IF EXISTS `heures_travail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `heures_travail` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `heures_normales` tinyint(1) NOT NULL DEFAULT '0',
  `ferie_paye` tinyint(1) NOT NULL DEFAULT '0',
  `absence_paye` tinyint(1) NOT NULL DEFAULT '0',
  `absence` tinyint(1) NOT NULL DEFAULT '0',
  `heures_sup_0` tinyint(1) NOT NULL DEFAULT '0',
  `heures_sup_25` tinyint(1) NOT NULL DEFAULT '0',
  `heures_sup_50` tinyint(1) NOT NULL DEFAULT '0',
  `heures_sup_100` tinyint(1) NOT NULL DEFAULT '0',
  `commentaire` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `heures_travail`
--

LOCK TABLES `heures_travail` WRITE;
/*!40000 ALTER TABLE `heures_travail` DISABLE KEYS */;
/*!40000 ALTER TABLE `heures_travail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horaire_exceptionnels`
--

DROP TABLE IF EXISTS `horaire_exceptionnels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horaire_exceptionnels` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `employee_id` bigint unsigned NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `horaire_id` bigint unsigned DEFAULT NULL,
  `horaire_periodique_id` bigint unsigned DEFAULT NULL,
  `jour_debut` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `horaire_exceptionnels_employee_id_foreign` (`employee_id`),
  KEY `horaire_exceptionnels_horaire_id_foreign` (`horaire_id`),
  KEY `horaire_exceptionnels_horaire_periodique_id_foreign` (`horaire_periodique_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horaire_exceptionnels`
--

LOCK TABLES `horaire_exceptionnels` WRITE;
/*!40000 ALTER TABLE `horaire_exceptionnels` DISABLE KEYS */;
/*!40000 ALTER TABLE `horaire_exceptionnels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horaire_periodiques`
--

DROP TABLE IF EXISTS `horaire_periodiques`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horaire_periodiques` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `periode` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horaire_periodiques`
--

LOCK TABLES `horaire_periodiques` WRITE;
/*!40000 ALTER TABLE `horaire_periodiques` DISABLE KEYS */;
/*!40000 ALTER TABLE `horaire_periodiques` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horaires`
--

DROP TABLE IF EXISTS `horaires`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horaires` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `typePlageHoraire` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'obligatoire',
  `tauxPlageHoraire` int NOT NULL DEFAULT '0',
  `tauxType` enum('heure','jours') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'heure',
  `entreeDe` time NOT NULL DEFAULT '00:00:00',
  `entreeA` time NOT NULL DEFAULT '00:00:00',
  `penaliteEntree` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reposDe` time NOT NULL DEFAULT '00:00:00',
  `reposA` time NOT NULL DEFAULT '00:00:00',
  `deduireRepos` enum('Deduit','NonDeduit') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dureeRepos` time NOT NULL DEFAULT '00:00:00',
  `sortieDe` time NOT NULL DEFAULT '00:00:00',
  `sortieA` time NOT NULL DEFAULT '00:00:00',
  `pointageAutomatique` tinyint(1) NOT NULL DEFAULT '0',
  `penaliteSortie` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cumul` int NOT NULL DEFAULT '0',
  `jourTravaille` int NOT NULL DEFAULT '0',
  `couleur` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#000000',
  `groupe_horaire_id` int DEFAULT NULL,
  `heureDebut` time DEFAULT NULL,
  `heureFin` time DEFAULT NULL,
  `horaireJournalier` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `typeHoraire` int DEFAULT NULL,
  `veille` tinyint(1) NOT NULL DEFAULT '0',
  `jourPlus1` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horaires`
--

LOCK TABLES `horaires` WRITE;
/*!40000 ALTER TABLE `horaires` DISABLE KEYS */;
/*!40000 ALTER TABLE `horaires` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imprimables`
--

DROP TABLE IF EXISTS `imprimables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imprimables` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imprimables`
--

LOCK TABLES `imprimables` WRITE;
/*!40000 ALTER TABLE `imprimables` DISABLE KEYS */;
/*!40000 ALTER TABLE `imprimables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jour_feries`
--

DROP TABLE IF EXISTS `jour_feries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jour_feries` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('paye','non_paye') COLLATE utf8mb4_unicode_ci NOT NULL,
  `duree` time DEFAULT NULL,
  `taux` decimal(8,2) DEFAULT NULL,
  `categorie` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fix` tinyint(1) NOT NULL DEFAULT '0',
  `fix_day` int DEFAULT NULL,
  `fix_month` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jour_feries`
--

LOCK TABLES `jour_feries` WRITE;
/*!40000 ALTER TABLE `jour_feries` DISABLE KEYS */;
/*!40000 ALTER TABLE `jour_feries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ligne__bon__entres`
--

DROP TABLE IF EXISTS `ligne__bon__entres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ligne__bon__entres` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `produit_id` bigint unsigned NOT NULL,
  `id_bon_Entre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantite` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `N_lot` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ligne__bon__entres_produit_id_foreign` (`produit_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ligne__bon__entres`
--

LOCK TABLES `ligne__bon__entres` WRITE;
/*!40000 ALTER TABLE `ligne__bon__entres` DISABLE KEYS */;
/*!40000 ALTER TABLE `ligne__bon__entres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ligne__bon__sourties`
--

DROP TABLE IF EXISTS `ligne__bon__sourties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ligne__bon__sourties` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `produit_id` bigint unsigned NOT NULL,
  `id_bon_Sourtie` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantite` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `N_lot` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ligne__bon__sourties_produit_id_foreign` (`produit_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ligne__bon__sourties`
--

LOCK TABLES `ligne__bon__sourties` WRITE;
/*!40000 ALTER TABLE `ligne__bon__sourties` DISABLE KEYS */;
/*!40000 ALTER TABLE `ligne__bon__sourties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ligne_commandes`
--

DROP TABLE IF EXISTS `ligne_commandes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ligne_commandes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `commande_id` bigint unsigned NOT NULL,
  `produit_id` bigint unsigned NOT NULL,
  `quantite` bigint unsigned NOT NULL,
  `prix_unitaire` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ligne_commandes_commande_id_foreign` (`commande_id`),
  KEY `ligne_commandes_produit_id_foreign` (`produit_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ligne_commandes`
--

LOCK TABLES `ligne_commandes` WRITE;
/*!40000 ALTER TABLE `ligne_commandes` DISABLE KEYS */;
/*!40000 ALTER TABLE `ligne_commandes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ligne_devis`
--

DROP TABLE IF EXISTS `ligne_devis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ligne_devis` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `produit_id` bigint unsigned NOT NULL,
  `quantite` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prix_vente` decimal(8,2) DEFAULT NULL,
  `id_devis` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ligne_devis_produit_id_foreign` (`produit_id`),
  KEY `ligne_devis_id_devis_foreign` (`id_devis`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ligne_devis`
--

LOCK TABLES `ligne_devis` WRITE;
/*!40000 ALTER TABLE `ligne_devis` DISABLE KEYS */;
/*!40000 ALTER TABLE `ligne_devis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ligne_factures`
--

DROP TABLE IF EXISTS `ligne_factures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ligne_factures` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `produit_id` bigint unsigned NOT NULL,
  `quantite` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prix_vente` decimal(8,2) DEFAULT NULL,
  `id_facture` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ligne_factures_produit_id_foreign` (`produit_id`),
  KEY `ligne_factures_id_facture_foreign` (`id_facture`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ligne_factures`
--

LOCK TABLES `ligne_factures` WRITE;
/*!40000 ALTER TABLE `ligne_factures` DISABLE KEYS */;
/*!40000 ALTER TABLE `ligne_factures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ligne_livraisons`
--

DROP TABLE IF EXISTS `ligne_livraisons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ligne_livraisons` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `produit_id` bigint unsigned NOT NULL,
  `quantite` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prix_vente` decimal(8,2) DEFAULT NULL,
  `id_ligne_livraisons` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ligne_livraisons_produit_id_foreign` (`produit_id`),
  KEY `ligne_livraisons_id_ligne_livraisons_foreign` (`id_ligne_livraisons`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ligne_livraisons`
--

LOCK TABLES `ligne_livraisons` WRITE;
/*!40000 ALTER TABLE `ligne_livraisons` DISABLE KEYS */;
/*!40000 ALTER TABLE `ligne_livraisons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ligne_preparation_commandes`
--

DROP TABLE IF EXISTS `ligne_preparation_commandes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ligne_preparation_commandes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `preparation_id` bigint unsigned NOT NULL,
  `produit_id` bigint unsigned NOT NULL,
  `quantite` bigint unsigned NOT NULL,
  `prix_unitaire` bigint unsigned NOT NULL,
  `lot` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ligne_preparation_commandes_preparation_id_foreign` (`preparation_id`),
  KEY `ligne_preparation_commandes_produit_id_foreign` (`produit_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ligne_preparation_commandes`
--

LOCK TABLES `ligne_preparation_commandes` WRITE;
/*!40000 ALTER TABLE `ligne_preparation_commandes` DISABLE KEYS */;
/*!40000 ALTER TABLE `ligne_preparation_commandes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ligneencaissements`
--

DROP TABLE IF EXISTS `ligneencaissements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ligneencaissements` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `entrer_comptes_id` bigint unsigned NOT NULL,
  `encaissements_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ligneencaissements_entrer_comptes_id_foreign` (`entrer_comptes_id`),
  KEY `ligneencaissements_encaissements_id_foreign` (`encaissements_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ligneencaissements`
--

LOCK TABLES `ligneencaissements` WRITE;
/*!40000 ALTER TABLE `ligneencaissements` DISABLE KEYS */;
/*!40000 ALTER TABLE `ligneencaissements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ligneentrercomptes`
--

DROP TABLE IF EXISTS `ligneentrercomptes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ligneentrercomptes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `entrer_comptes_id` bigint unsigned NOT NULL,
  `client_id` bigint unsigned NOT NULL,
  `id_facture` bigint unsigned NOT NULL,
  `avance` decimal(8,2) DEFAULT NULL,
  `restee` decimal(8,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ligneentrercomptes_entrer_comptes_id_foreign` (`entrer_comptes_id`),
  KEY `ligneentrercomptes_client_id_foreign` (`client_id`),
  KEY `ligneentrercomptes_id_facture_foreign` (`id_facture`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ligneentrercomptes`
--

LOCK TABLES `ligneentrercomptes` WRITE;
/*!40000 ALTER TABLE `ligneentrercomptes` DISABLE KEYS */;
/*!40000 ALTER TABLE `ligneentrercomptes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lignelivraisons`
--

DROP TABLE IF EXISTS `lignelivraisons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lignelivraisons` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `produit_id` bigint unsigned NOT NULL,
  `id_bon_Livraison` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantite` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lignelivraisons_produit_id_foreign` (`produit_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lignelivraisons`
--

LOCK TABLES `lignelivraisons` WRITE;
/*!40000 ALTER TABLE `lignelivraisons` DISABLE KEYS */;
/*!40000 ALTER TABLE `lignelivraisons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `livreurs`
--

DROP TABLE IF EXISTS `livreurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `livreurs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cin` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tele` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adresse` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `livreurs_cin_unique` (`cin`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `livreurs`
--

LOCK TABLES `livreurs` WRITE;
/*!40000 ALTER TABLE `livreurs` DISABLE KEYS */;
/*!40000 ALTER TABLE `livreurs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `memos`
--

DROP TABLE IF EXISTS `memos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `memos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `memos`
--

LOCK TABLES `memos` WRITE;
/*!40000 ALTER TABLE `memos` DISABLE KEYS */;
/*!40000 ALTER TABLE `memos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `memos_constantes`
--

DROP TABLE IF EXISTS `memos_constantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `memos_constantes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `memos_constantes`
--

LOCK TABLES `memos_constantes` WRITE;
/*!40000 ALTER TABLE `memos_constantes` DISABLE KEYS */;
/*!40000 ALTER TABLE `memos_constantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=136 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2014_10_12_000000_create_users_table',1),(2,'2014_10_12_100000_create_password_reset_tokens_table',1),(3,'2019_08_19_000000_create_failed_jobs_table',1),(4,'2019_12_14_000001_create_personal_access_tokens_table',1),(5,'2024_02_14_090056_create_calibre',1),(6,'2024_02_14_090057_create_categories_table',1),(7,'2024_02_14_095626_create_produits_table',1),(8,'2024_02_14_113433_create_fournisseurs_table',1),(9,'2024_02_14_113443_create_regions_table',1),(10,'2024_02_14_113443_create_zones_table',1),(11,'2024_02_14_113445_create_clients_table',1),(12,'2024_02_14_113446_create_site_clients_table',1),(13,'2024_02_14_113502_create_commandes_table',1),(14,'2024_02_14_113507_create_ligne_commandes_table',1),(15,'2024_02_14_113514_create_status_commandes_table',1),(16,'2024_02_23_082128_create_roles_table',1),(17,'2024_02_23_082131_create_permissions_table',1),(18,'2024_02_23_082133_create_role_user_table',1),(19,'2024_02_23_082136_create_permission_role_table',1),(20,'2024_03_05_213408_create_livreurs_table',1),(21,'2024_03_05_213637_create_vehicules_table',1),(22,'2024_03_05_213654_create_objectifs_table',1),(23,'2024_03_05_213740_create_vehicule_livreurs_table',1),(24,'2024_03_08_072214_create_chiffre_affaires_table',1),(25,'2024_03_08_100736_create_reclamations_table',1),(26,'2024_03_14_095822_create_devis_table',1),(27,'2024_03_14_095823_create_ligne_devis_table',1),(28,'2024_03_14_095841_create_factures_table',1),(29,'2024_03_14_095842_create_entrer_comptes_table',1),(30,'2024_03_14_104358_permis',1),(31,'2024_03_15_095843_create_etat_recouvrements_table',1),(32,'2024_03_19_131551_create_stock_table',1),(33,'2024_03_19_131830_create_chargement_commandes_table',1),(34,'2024_03_19_131851_create_preparation_commandes_table',1),(35,'2024_03_19_131852_create_ligne_preparation_commandes_table',1),(36,'2024_03_20_144734_create_ligne_entrer_comptes_table',1),(37,'2024_04_02_141214_create_comptes_table',1),(38,'2024_04_02_141354_create_encaissements_table',1),(39,'2024_04_02_141425_create_ligneencaissements_table',1),(40,'2024_04_15_182302_create_agents_table',1),(41,'2024_04_16_144055_create_ligne_factures_table',1),(42,'2024_04_16_144124_create_bon__livraisons_table',1),(43,'2024_05_09_113954_create_ligne_livraisons_table',1),(44,'2024_05_20_094215_create_group_rubriques_table',1),(45,'2024_05_27_141912_create_autorisations_table',1),(46,'2024_05_29_095748_create_rubriques_table',1),(47,'2024_06_03_210221_create_vis_table',1),(48,'2024_06_05_142501_create_oeufcasses_table',1),(49,'2024_06_05_142519_create_oeuffini_semifinis_table',1),(50,'2024_07_19_134823_lignelivraisons',1),(51,'2024_08_05_085417_create_stock_magasins_table',1),(52,'2024_08_09_095154_create_stock__productions_table',1),(53,'2024_08_09_104000_create_bon__entres_table',1),(54,'2024_08_09_104011_create_bon__sourties_table',1),(55,'2024_08_09_104054_create_ligne__bon__entres_table',1),(56,'2024_08_09_132241_create_ligne__bon__sourties_table',1),(57,'2024_08_09_145915_create_offres_prix_table',1),(58,'2024_08_09_150030_create_offre_details_table',1),(59,'2024_08_12_095105_create_groupe_clients_table',1),(60,'2024_08_12_111242_client_groupe_client',1),(61,'2024_08_28_085627_create_offre_groupe_table',1),(62,'2024_09_04_093013_create_employes_table',1),(63,'2024_09_04_093041_create_departements_table',1),(64,'2024_09_04_102739_create_employes_departement_table',1),(65,'2024_09_10_084714_create_contact_clients_table',1),(66,'2024_09_20_151653_create_contrats_table',1),(67,'2024_10_03_114035_create_employee_histories_table',1),(68,'2024_11_26_085638_create_contract_types_table',1),(69,'2025_01_15_000001_add_calcul_fields_to_rubriques_table',1),(70,'2025_01_15_000002_add_is_complete_to_rubriques_table',1),(71,'2025_01_15_000003_create_types_calculs_table',1),(72,'2025_01_21_135613_create_group_motif_absences_table',1),(73,'2025_01_22_092855_create_detail_motif_absences_table',1),(74,'2025_01_24_110513_create_jour_feries_table',1),(75,'2025_01_30_151925_create_absence_previsionnels_table',1),(76,'2025_02_03_143750_create_groupe_horaires_table',1),(77,'2025_02_03_154813_create_horaires_table',1),(78,'2025_02_18_114457_create_horaire_periodiques_table',1),(79,'2025_02_18_125501_create_details_periodiques_table',1),(80,'2025_02_27_104850_create_calendries_table',1),(81,'2025_02_27_104956_create_details_calendries_table',1),(82,'2025_03_21_103103_create_regle_compensation_table',1),(83,'2025_03_21_142035_create_penalites_table',1),(84,'2025_03_25_125256_create_groupe_arrondi_table',1),(85,'2025_03_26_115334_create_arrondis_table',1),(86,'2025_04_08_170439_create_parametre_bases_table',1),(87,'2025_04_10_112719_create_details_regles_table',1),(88,'2025_04_11_164051_create_heure_travails_table',1),(89,'2025_04_15_114638_create_horaire_exceptionnels_table',1),(90,'2025_04_23_114927_create_group_constantes_table',1),(91,'2025_04_24_105126_create_type_constantes_table',1),(92,'2025_04_25_144401_create_gp_pays',1),(93,'2025_04_25_145016_creaye_gp_villes',1),(94,'2025_04_25_145051_create_gp_communes',1),(95,'2025_04_28_093519_create_gp_services_table',1),(96,'2025_04_28_093557_create_gp_unites_table',1),(97,'2025_04_28_093632_create_gp_postes_table',1),(98,'2025_04_30_112308_create_type_rubriques_table',1),(99,'2025_05_02_092606_create_gp_calendriers_employes_table',1),(100,'2025_05_02_093704_create_memos_table',1),(101,'2025_05_06_090943_create_constantes_table',1),(102,'2025_05_07_093039_create_memos_constantes_table',1),(103,'2025_05_14_091422_add_infos_supplementaires_to_employes_table',1),(104,'2025_05_14_113538_make_bulletin_modele_nullable_in_employes_table',1),(105,'2025_05_14_135953_add_details_to_contrats_table',1),(106,'2025_05_19_094946_create_gp_banques_table',1),(107,'2025_05_19_094948_create_gp_agences_table',1),(108,'2025_05_19_094948_create_gp_comptes_bancaires_table',1),(109,'2025_05_26_091539_create_imprimables_table',1),(110,'2025_05_26_110620_create_mois_clotures_table',1),(111,'2025_05_26_111701_create_rappel_salaires_table',1),(112,'2025_05_26_115125_create_proprietes_table',1),(113,'2025_05_28_091208_create_gp_societes_table',1),(114,'2025_05_29_101033_create_calculs_table',1),(115,'2025_05_29_135541_create_gp_regle_employe_table',1),(116,'2025_06_10_081212_create_gp_theme_bultin_model_table',1),(117,'2025_06_11_094126_create_gp_bultin_models_table',1),(118,'2025_06_11_094148_create_gp_bultin_model_rubrique_table',1),(119,'2025_06_11_094213_create_gp_bultin_model_constante_table',1),(120,'2025_06_11_145642_create_gp_employe_bulletins_table',1),(121,'2025_07_22_091259_create_gp_group_paie_table',1),(122,'2025_07_22_092719_create_gp_paie_rubrique',1),(123,'2025_08_07_140335_create_gp_bon_sortie_table',1),(124,'2025_09_15_154031_create_gp_conges_table',1),(125,'2025_09_18_101715_create_gp_demandes_conges_table',1),(126,'2026_02_02_155429_create_mutuelles_table',2),(127,'2026_02_02_155444_create_regimes_mutuelle_table',2),(128,'2026_02_02_155603_create_affiliations_mutuelle_table',2),(129,'2026_02_04_000000_add_numero_adherent_to_affiliations_mutuelle_table',2),(130,'2026_02_04_000001_add_conjoint_ayant_droit_to_affiliations_mutuelle_table',2),(131,'2026_02_06_000100_create_mutuelle_documents_table',2),(132,'2026_02_06_000110_create_mutuelle_operations_table',2),(133,'2026_02_07_201700_refactor_mutuelle_operations_table',2),(134,'2026_02_07_203817_refactor_mutuelle_operations_table',3),(135,'2026_02_08_113508_add_operation_id_to_mutuelle_documents_table',4);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mois_clotures`
--

DROP TABLE IF EXISTS `mois_clotures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mois_clotures` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mois_clotures`
--

LOCK TABLES `mois_clotures` WRITE;
/*!40000 ALTER TABLE `mois_clotures` DISABLE KEYS */;
/*!40000 ALTER TABLE `mois_clotures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mutuelle_documents`
--

DROP TABLE IF EXISTS `mutuelle_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mutuelle_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `operation_id` bigint unsigned DEFAULT NULL,
  `employe_id` bigint unsigned NOT NULL,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_path` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mutuelle_documents_employe_id_foreign` (`employe_id`),
  KEY `mutuelle_documents_operation_id_index` (`operation_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mutuelle_documents`
--

LOCK TABLES `mutuelle_documents` WRITE;
/*!40000 ALTER TABLE `mutuelle_documents` DISABLE KEYS */;
INSERT INTO `mutuelle_documents` VALUES (1,1,5,'affiliations_mutuelle_Test_2026-02-05T11_12_31.527Z.pdf','mutuelles/documents/lNyxANIihMg2Ygcwz1n24FQwWlazvNhhlULeO9jt.pdf','affiliations_mutuelle_Test_2026-02-05T11_12_31.527Z.pdf','2026-02-08 10:51:53','2026-02-08 10:51:53');
/*!40000 ALTER TABLE `mutuelle_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mutuelle_operations`
--

DROP TABLE IF EXISTS `mutuelle_operations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mutuelle_operations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `affiliation_id` bigint unsigned NOT NULL,
  `numero_dossier` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `beneficiaire_type` enum('EMPLOYE','CONJOINT','ENFANT') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EMPLOYE',
  `beneficiaire_nom` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_operation` date NOT NULL,
  `date_depot` date DEFAULT NULL,
  `date_remboursement` date DEFAULT NULL,
  `type_operation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `statut` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EN_COURS',
  `montant_total` decimal(10,2) DEFAULT NULL,
  `montant_rembourse` decimal(10,2) NOT NULL DEFAULT '0.00',
  `reste_a_charge` decimal(10,2) DEFAULT NULL,
  `commentaire` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mutuelle_operations_affiliation_id_foreign` (`affiliation_id`),
  KEY `mutuelle_operations_date_operation_index` (`date_operation`),
  KEY `mutuelle_operations_numero_dossier_index` (`numero_dossier`),
  KEY `mutuelle_operations_statut_index` (`statut`(50))
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mutuelle_operations`
--

LOCK TABLES `mutuelle_operations` WRITE;
/*!40000 ALTER TABLE `mutuelle_operations` DISABLE KEYS */;
INSERT INTO `mutuelle_operations` VALUES (5,2,'2222222','EMPLOYE',NULL,'2026-02-09','2026-02-05','2026-02-18','DEPOT_DOSSIER','REMBOURSEE',250.00,100.00,150.00,NULL,'2026-02-09 15:18:04','2026-02-09 15:18:04'),(4,1,'11122','EMPLOYE',NULL,'2026-02-09','2026-02-09','2026-02-18','REMBOURSEMENT','TERMINEE',500.00,430.00,70.00,NULL,'2026-02-09 14:21:51','2026-02-09 14:21:51');
/*!40000 ALTER TABLE `mutuelle_operations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mutuelles`
--

DROP TABLE IF EXISTS `mutuelles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mutuelles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mutuelles`
--

LOCK TABLES `mutuelles` WRITE;
/*!40000 ALTER TABLE `mutuelles` DISABLE KEYS */;
INSERT INTO `mutuelles` VALUES (1,'CNSS - Caisse Nationale de Sécurité Sociale',1,'2026-02-07 18:55:41','2026-02-07 18:55:41'),(2,'RAMED - Régime d\'Assistance Médicale',1,'2026-02-07 18:55:41','2026-02-07 18:55:41'),(3,'AMO - Assurance Maladie Obligatoire',1,'2026-02-07 18:55:41','2026-02-07 18:55:41'),(4,'MGPAP - Mutuelle Générale du Personnel des Administrations Publiques',1,'2026-02-07 18:55:41','2026-02-07 18:55:41'),(5,'Mutuelle Atlas',1,'2026-02-07 18:55:41','2026-02-07 18:55:41'),(6,'Ancienne Mutuelle',0,'2026-02-07 18:55:41','2026-02-07 18:55:41');
/*!40000 ALTER TABLE `mutuelles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `objectifs`
--

DROP TABLE IF EXISTS `objectifs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `objectifs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type_objectif` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unite` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `valeur` int NOT NULL,
  `periode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `objectifs`
--

LOCK TABLES `objectifs` WRITE;
/*!40000 ALTER TABLE `objectifs` DISABLE KEYS */;
/*!40000 ALTER TABLE `objectifs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oeufcasses`
--

DROP TABLE IF EXISTS `oeufcasses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oeufcasses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `N_lot` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nbr_oeuf_cass` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Poid_moy_oeuf` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oeufcasses`
--

LOCK TABLES `oeufcasses` WRITE;
/*!40000 ALTER TABLE `oeufcasses` DISABLE KEYS */;
/*!40000 ALTER TABLE `oeufcasses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oeuffini_semifinis`
--

DROP TABLE IF EXISTS `oeuffini_semifinis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oeuffini_semifinis` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `eau_semifini` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entier_semifini` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `janne_semifini` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `blan_semifini` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LC_semifini` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oeufcongles_semifini` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entier_fini` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `janne_fini` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `blan_fini` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LC_fini` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oeufcongles_fini` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oeuffini_semifinis`
--

LOCK TABLES `oeuffini_semifinis` WRITE;
/*!40000 ALTER TABLE `oeuffini_semifinis` DISABLE KEYS */;
/*!40000 ALTER TABLE `oeuffini_semifinis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offre_details`
--

DROP TABLE IF EXISTS `offre_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offre_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `produit_id` bigint unsigned NOT NULL,
  `Prix` decimal(8,2) NOT NULL,
  `id_offre` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `offre_details_produit_id_foreign` (`produit_id`),
  KEY `offre_details_id_offre_foreign` (`id_offre`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offre_details`
--

LOCK TABLES `offre_details` WRITE;
/*!40000 ALTER TABLE `offre_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `offre_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offre_groupe_table`
--

DROP TABLE IF EXISTS `offre_groupe_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offre_groupe_table` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `Id_offre` bigint unsigned NOT NULL,
  `Id_groupe` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `offre_groupe_table_id_offre_foreign` (`Id_offre`),
  KEY `offre_groupe_table_id_groupe_foreign` (`Id_groupe`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offre_groupe_table`
--

LOCK TABLES `offre_groupe_table` WRITE;
/*!40000 ALTER TABLE `offre_groupe_table` DISABLE KEYS */;
/*!40000 ALTER TABLE `offre_groupe_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offres`
--

DROP TABLE IF EXISTS `offres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offres` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `Désignation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Offre_prix` decimal(8,2) NOT NULL,
  `Date_début` date NOT NULL,
  `Date_fin` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offres`
--

LOCK TABLES `offres` WRITE;
/*!40000 ALTER TABLE `offres` DISABLE KEYS */;
/*!40000 ALTER TABLE `offres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parametre_bases`
--

DROP TABLE IF EXISTS `parametre_bases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parametre_bases` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `parametre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `valeur` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parametre_bases`
--

LOCK TABLES `parametre_bases` WRITE;
/*!40000 ALTER TABLE `parametre_bases` DISABLE KEYS */;
/*!40000 ALTER TABLE `parametre_bases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `penalites`
--

DROP TABLE IF EXISTS `penalites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `penalites` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('entree','sortie') COLLATE utf8mb4_unicode_ci NOT NULL,
  `ecart_min` decimal(8,2) NOT NULL,
  `ecart_max` decimal(8,2) NOT NULL,
  `penalite` decimal(8,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `penalites`
--

LOCK TABLES `penalites` WRITE;
/*!40000 ALTER TABLE `penalites` DISABLE KEYS */;
/*!40000 ALTER TABLE `penalites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permis`
--

DROP TABLE IF EXISTS `permis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permis` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `livreur_id` bigint unsigned NOT NULL,
  `n_permis` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_permis` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_permis` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `permis_livreur_id_foreign` (`livreur_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permis`
--

LOCK TABLES `permis` WRITE;
/*!40000 ALTER TABLE `permis` DISABLE KEYS */;
/*!40000 ALTER TABLE `permis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permission_role`
--

DROP TABLE IF EXISTS `permission_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permission_role` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `role_id` bigint unsigned NOT NULL,
  `permission_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permission_role_role_id_permission_id_unique` (`role_id`,`permission_id`),
  KEY `permission_role_permission_id_foreign` (`permission_id`)
) ENGINE=MyISAM AUTO_INCREMENT=161 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission_role`
--

LOCK TABLES `permission_role` WRITE;
/*!40000 ALTER TABLE `permission_role` DISABLE KEYS */;
INSERT INTO `permission_role` VALUES (1,1,1,NULL,NULL),(2,1,2,NULL,NULL),(3,1,3,NULL,NULL),(4,1,4,NULL,NULL),(5,1,5,NULL,NULL),(6,1,6,NULL,NULL),(7,1,7,NULL,NULL),(8,1,8,NULL,NULL),(9,1,9,NULL,NULL),(10,1,10,NULL,NULL),(11,1,11,NULL,NULL),(12,1,12,NULL,NULL),(13,1,13,NULL,NULL),(14,1,14,NULL,NULL),(15,1,15,NULL,NULL),(16,1,16,NULL,NULL),(17,1,17,NULL,NULL),(18,1,18,NULL,NULL),(19,1,19,NULL,NULL),(20,1,20,NULL,NULL),(21,1,21,NULL,NULL),(22,1,22,NULL,NULL),(23,1,23,NULL,NULL),(24,1,24,NULL,NULL),(25,1,25,NULL,NULL),(26,1,26,NULL,NULL),(27,1,27,NULL,NULL),(28,1,28,NULL,NULL),(29,1,29,NULL,NULL),(30,1,30,NULL,NULL),(31,1,31,NULL,NULL),(32,1,32,NULL,NULL),(33,1,33,NULL,NULL),(34,1,34,NULL,NULL),(35,1,35,NULL,NULL),(36,1,36,NULL,NULL),(37,1,37,NULL,NULL),(38,1,38,NULL,NULL),(39,1,39,NULL,NULL),(40,1,40,NULL,NULL),(41,1,41,NULL,NULL),(42,1,42,NULL,NULL),(43,1,43,NULL,NULL),(44,1,44,NULL,NULL),(45,1,45,NULL,NULL),(46,1,46,NULL,NULL),(47,1,47,NULL,NULL),(48,1,48,NULL,NULL),(49,1,49,NULL,NULL),(50,1,50,NULL,NULL),(51,1,51,NULL,NULL),(52,1,52,NULL,NULL),(53,1,53,NULL,NULL),(54,1,54,NULL,NULL),(55,1,55,NULL,NULL),(56,1,56,NULL,NULL),(57,1,57,NULL,NULL),(58,1,58,NULL,NULL),(59,1,59,NULL,NULL),(60,1,60,NULL,NULL),(61,1,61,NULL,NULL),(62,1,62,NULL,NULL),(63,1,63,NULL,NULL),(64,1,64,NULL,NULL),(65,1,65,NULL,NULL),(66,1,66,NULL,NULL),(67,1,67,NULL,NULL),(68,1,68,NULL,NULL),(69,1,69,NULL,NULL),(70,1,70,NULL,NULL),(71,1,71,NULL,NULL),(72,1,72,NULL,NULL),(73,1,73,NULL,NULL),(74,1,74,NULL,NULL),(75,1,75,NULL,NULL),(76,1,76,NULL,NULL),(77,1,77,NULL,NULL),(78,1,78,NULL,NULL),(79,1,79,NULL,NULL),(80,1,80,NULL,NULL),(81,1,81,NULL,NULL),(82,1,82,NULL,NULL),(83,1,83,NULL,NULL),(84,1,84,NULL,NULL),(85,1,85,NULL,NULL),(86,1,86,NULL,NULL),(87,1,87,NULL,NULL),(88,1,88,NULL,NULL),(89,1,89,NULL,NULL),(90,1,90,NULL,NULL),(91,1,91,NULL,NULL),(92,1,92,NULL,NULL),(93,1,93,NULL,NULL),(94,1,94,NULL,NULL),(95,1,95,NULL,NULL),(96,1,96,NULL,NULL),(97,1,97,NULL,NULL),(98,1,98,NULL,NULL),(99,1,99,NULL,NULL),(100,1,100,NULL,NULL),(101,1,101,NULL,NULL),(102,1,102,NULL,NULL),(103,1,103,NULL,NULL),(104,1,104,NULL,NULL),(105,1,105,NULL,NULL),(106,1,106,NULL,NULL),(107,1,107,NULL,NULL),(108,1,108,NULL,NULL),(109,1,109,NULL,NULL),(110,1,110,NULL,NULL),(111,1,111,NULL,NULL),(112,1,112,NULL,NULL),(113,1,113,NULL,NULL),(114,1,114,NULL,NULL),(115,1,115,NULL,NULL),(116,1,116,NULL,NULL),(117,1,117,NULL,NULL),(118,1,118,NULL,NULL),(119,1,119,NULL,NULL),(120,1,120,NULL,NULL),(121,1,121,NULL,NULL),(122,1,122,NULL,NULL),(123,1,123,NULL,NULL),(124,1,124,NULL,NULL),(125,1,125,NULL,NULL),(126,1,126,NULL,NULL),(127,1,127,NULL,NULL),(128,1,128,NULL,NULL),(129,1,129,NULL,NULL),(130,1,130,NULL,NULL),(131,1,131,NULL,NULL),(132,1,132,NULL,NULL),(133,1,133,NULL,NULL),(134,1,134,NULL,NULL),(135,1,135,NULL,NULL),(136,1,136,NULL,NULL),(137,1,137,NULL,NULL),(138,1,138,NULL,NULL),(139,1,139,NULL,NULL),(140,1,140,NULL,NULL),(141,1,141,NULL,NULL),(142,1,142,NULL,NULL),(143,1,143,NULL,NULL),(144,1,144,NULL,NULL),(145,1,145,NULL,NULL),(146,1,146,NULL,NULL),(147,1,147,NULL,NULL),(148,1,148,NULL,NULL),(149,1,149,NULL,NULL),(150,1,150,NULL,NULL),(151,1,151,NULL,NULL),(152,1,152,NULL,NULL),(153,1,153,NULL,NULL),(154,1,154,NULL,NULL),(155,1,155,NULL,NULL),(156,1,156,NULL,NULL),(157,1,157,NULL,NULL),(158,1,158,NULL,NULL),(159,1,159,NULL,NULL),(160,1,160,NULL,NULL);
/*!40000 ALTER TABLE `permission_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=161 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'view_all_products','2026-02-07 18:55:54','2026-02-07 18:55:54'),(2,'create_product','2026-02-07 18:55:54','2026-02-07 18:55:54'),(3,'edit_product','2026-02-07 18:55:54','2026-02-07 18:55:54'),(4,'delete_product','2026-02-07 18:55:54','2026-02-07 18:55:54'),(5,'view_all_livreurs','2026-02-07 18:55:54','2026-02-07 18:55:54'),(6,'create_livreurs','2026-02-07 18:55:54','2026-02-07 18:55:54'),(7,'update_livreurs','2026-02-07 18:55:54','2026-02-07 18:55:54'),(8,'delete_livreurs','2026-02-07 18:55:54','2026-02-07 18:55:54'),(9,'delete_fournisseurs','2026-02-07 18:55:54','2026-02-07 18:55:54'),(10,'update_fournisseurs','2026-02-07 18:55:54','2026-02-07 18:55:54'),(11,'create_fournisseurs','2026-02-07 18:55:54','2026-02-07 18:55:54'),(12,'view_all_fournisseurs','2026-02-07 18:55:54','2026-02-07 18:55:54'),(13,'delete_user','2026-02-07 18:55:54','2026-02-07 18:55:54'),(14,'edit_user','2026-02-07 18:55:54','2026-02-07 18:55:54'),(15,'create_user','2026-02-07 18:55:54','2026-02-07 18:55:54'),(16,'view_all_users','2026-02-07 18:55:54','2026-02-07 18:55:54'),(17,'delete_clients','2026-02-07 18:55:54','2026-02-07 18:55:54'),(18,'update_clients','2026-02-07 18:55:54','2026-02-07 18:55:54'),(19,'view_all_clients','2026-02-07 18:55:54','2026-02-07 18:55:54'),(20,'create_clients','2026-02-07 18:55:54','2026-02-07 18:55:54'),(21,'view_all_vehicules','2026-02-07 18:55:54','2026-02-07 18:55:54'),(22,'update_vehicules','2026-02-07 18:55:54','2026-02-07 18:55:54'),(23,'create_vehicules','2026-02-07 18:55:54','2026-02-07 18:55:54'),(24,'delete_vehicules','2026-02-07 18:55:54','2026-02-07 18:55:54'),(25,'view_all_objectifs','2026-02-07 18:55:54','2026-02-07 18:55:54'),(26,'create_objectifs','2026-02-07 18:55:54','2026-02-07 18:55:54'),(27,'update_objectifs','2026-02-07 18:55:54','2026-02-07 18:55:54'),(28,'delete_objectifs','2026-02-07 18:55:54','2026-02-07 18:55:54'),(29,'view_all_commandes','2026-02-07 18:55:54','2026-02-07 18:55:54'),(30,'create_commandes','2026-02-07 18:55:54','2026-02-07 18:55:54'),(31,'update_commandes','2026-02-07 18:55:54','2026-02-07 18:55:54'),(32,'delete_commandes','2026-02-07 18:55:54','2026-02-07 18:55:54'),(33,'view_all_employes','2026-02-07 18:55:54','2026-02-07 18:55:54'),(34,'create_employes','2026-02-07 18:55:54','2026-02-07 18:55:54'),(35,'update_employes','2026-02-07 18:55:55','2026-02-07 18:55:55'),(36,'delete_employes','2026-02-07 18:55:55','2026-02-07 18:55:55'),(37,'view_emp_historique','2026-02-07 18:55:55','2026-02-07 18:55:55'),(38,'view_emp_contrats','2026-02-07 18:55:55','2026-02-07 18:55:55'),(39,'view_all_employee_histories','2026-02-07 18:55:55','2026-02-07 18:55:55'),(40,'create_employee_histories','2026-02-07 18:55:55','2026-02-07 18:55:55'),(41,'update_employee_histories','2026-02-07 18:55:55','2026-02-07 18:55:55'),(42,'delete_employee_histories','2026-02-07 18:55:55','2026-02-07 18:55:55'),(43,'view_all_contrats','2026-02-07 18:55:55','2026-02-07 18:55:55'),(44,'create_contrats','2026-02-07 18:55:55','2026-02-07 18:55:55'),(45,'update_contrats','2026-02-07 18:55:55','2026-02-07 18:55:55'),(46,'delete_contrats','2026-02-07 18:55:55','2026-02-07 18:55:55'),(47,'view_all_absences','2026-02-07 18:55:55','2026-02-07 18:55:55'),(48,'create_absences','2026-02-07 18:55:55','2026-02-07 18:55:55'),(49,'update_absences','2026-02-07 18:55:55','2026-02-07 18:55:55'),(50,'delete_absences','2026-02-07 18:55:55','2026-02-07 18:55:55'),(51,'view_all_jour_feries','2026-02-07 18:55:55','2026-02-07 18:55:55'),(52,'create_jour_feries','2026-02-07 18:55:55','2026-02-07 18:55:55'),(53,'update_jour_feries','2026-02-07 18:55:55','2026-02-07 18:55:55'),(54,'delete_jour_feries','2026-02-07 18:55:55','2026-02-07 18:55:55'),(55,'view_all_calendries','2026-02-07 18:55:55','2026-02-07 18:55:55'),(56,'create_calendries','2026-02-07 18:55:55','2026-02-07 18:55:55'),(57,'update_calendries','2026-02-07 18:55:55','2026-02-07 18:55:55'),(58,'delete_calendries','2026-02-07 18:55:55','2026-02-07 18:55:55'),(59,'view_all_horaires','2026-02-07 18:55:55','2026-02-07 18:55:55'),(60,'create_horaires','2026-02-07 18:55:55','2026-02-07 18:55:55'),(61,'update_horaires','2026-02-07 18:55:55','2026-02-07 18:55:55'),(62,'delete_horaires','2026-02-07 18:55:55','2026-02-07 18:55:55'),(63,'view_all_horaire_periodiques','2026-02-07 18:55:55','2026-02-07 18:55:55'),(64,'create_horaire_periodiques','2026-02-07 18:55:55','2026-02-07 18:55:55'),(65,'update_horaire_periodiques','2026-02-07 18:55:55','2026-02-07 18:55:55'),(66,'delete_horaire_periodiques','2026-02-07 18:55:55','2026-02-07 18:55:55'),(67,'view_all_rubriques','2026-02-07 18:55:55','2026-02-07 18:55:55'),(68,'create_rubriques','2026-02-07 18:55:55','2026-02-07 18:55:55'),(69,'update_rubriques','2026-02-07 18:55:55','2026-02-07 18:55:55'),(70,'delete_rubriques','2026-02-07 18:55:55','2026-02-07 18:55:55'),(71,'view_all_constantes','2026-02-07 18:55:55','2026-02-07 18:55:55'),(72,'create_constantes','2026-02-07 18:55:55','2026-02-07 18:55:55'),(73,'update_constantes','2026-02-07 18:55:55','2026-02-07 18:55:55'),(74,'delete_constantes','2026-02-07 18:55:55','2026-02-07 18:55:55'),(75,'view_all_groupes_paie','2026-02-07 18:55:55','2026-02-07 18:55:55'),(76,'create_groupes_paie','2026-02-07 18:55:55','2026-02-07 18:55:55'),(77,'update_groupes_paie','2026-02-07 18:55:55','2026-02-07 18:55:55'),(78,'delete_groupes_paie','2026-02-07 18:55:55','2026-02-07 18:55:55'),(79,'view_all_bultin_models','2026-02-07 18:55:55','2026-02-07 18:55:55'),(80,'create_bultin_models','2026-02-07 18:55:55','2026-02-07 18:55:55'),(81,'update_bultin_models','2026-02-07 18:55:55','2026-02-07 18:55:55'),(82,'delete_bultin_models','2026-02-07 18:55:55','2026-02-07 18:55:55'),(83,'view_all_theme_bultin_models','2026-02-07 18:55:55','2026-02-07 18:55:55'),(84,'create_theme_bultin_models','2026-02-07 18:55:55','2026-02-07 18:55:55'),(85,'update_theme_bultin_models','2026-02-07 18:55:55','2026-02-07 18:55:55'),(86,'delete_theme_bultin_models','2026-02-07 18:55:55','2026-02-07 18:55:55'),(87,'view_all_absence_previsionnels','2026-02-07 18:55:55','2026-02-07 18:55:55'),(88,'create_absence_previsionnels','2026-02-07 18:55:55','2026-02-07 18:55:55'),(89,'update_absence_previsionnels','2026-02-07 18:55:55','2026-02-07 18:55:55'),(90,'delete_absence_previsionnels','2026-02-07 18:55:55','2026-02-07 18:55:55'),(91,'view_all_conges','2026-02-07 18:55:55','2026-02-07 18:55:55'),(92,'create_conges','2026-02-07 18:55:55','2026-02-07 18:55:55'),(93,'update_conges','2026-02-07 18:55:55','2026-02-07 18:55:55'),(94,'delete_conges','2026-02-07 18:55:55','2026-02-07 18:55:55'),(95,'view_all_demandes_conges','2026-02-07 18:55:55','2026-02-07 18:55:55'),(96,'create_demandes_conges','2026-02-07 18:55:55','2026-02-07 18:55:55'),(97,'update_demandes_conges','2026-02-07 18:55:55','2026-02-07 18:55:55'),(98,'delete_demandes_conges','2026-02-07 18:55:55','2026-02-07 18:55:55'),(99,'view_bulletin_paie','2026-02-07 18:55:55','2026-02-07 18:55:55'),(100,'view_valeur_base','2026-02-07 18:55:55','2026-02-07 18:55:55'),(101,'view_all_societes','2026-02-07 18:55:55','2026-02-07 18:55:55'),(102,'create_societes','2026-02-07 18:55:55','2026-02-07 18:55:55'),(103,'update_societes','2026-02-07 18:55:55','2026-02-07 18:55:55'),(104,'delete_societes','2026-02-07 18:55:55','2026-02-07 18:55:55'),(105,'view_all_bon_de_sortie','2026-02-07 18:55:55','2026-02-07 18:55:55'),(106,'create_bon_de_sortie','2026-02-07 18:55:55','2026-02-07 18:55:55'),(107,'update_bon_de_sortie','2026-02-07 18:55:56','2026-02-07 18:55:56'),(108,'delete_bon_de_sortie','2026-02-07 18:55:56','2026-02-07 18:55:56'),(109,'view_all_regle_compensation','2026-02-07 18:55:56','2026-02-07 18:55:56'),(110,'create_regle_compensation','2026-02-07 18:55:56','2026-02-07 18:55:56'),(111,'update_regle_compensation','2026-02-07 18:55:56','2026-02-07 18:55:56'),(112,'delete_regle_compensation','2026-02-07 18:55:56','2026-02-07 18:55:56'),(113,'view_all_penalites','2026-02-07 18:55:56','2026-02-07 18:55:56'),(114,'create_penalites','2026-02-07 18:55:56','2026-02-07 18:55:56'),(115,'update_penalites','2026-02-07 18:55:56','2026-02-07 18:55:56'),(116,'delete_penalites','2026-02-07 18:55:56','2026-02-07 18:55:56'),(117,'view_all_arrondis','2026-02-07 18:55:56','2026-02-07 18:55:56'),(118,'create_arrondis','2026-02-07 18:55:56','2026-02-07 18:55:56'),(119,'update_arrondis','2026-02-07 18:55:56','2026-02-07 18:55:56'),(120,'delete_arrondis','2026-02-07 18:55:56','2026-02-07 18:55:56'),(121,'view_all_parametre_base','2026-02-07 18:55:56','2026-02-07 18:55:56'),(122,'create_parametre_base','2026-02-07 18:55:56','2026-02-07 18:55:56'),(123,'update_parametre_base','2026-02-07 18:55:56','2026-02-07 18:55:56'),(124,'delete_parametre_base','2026-02-07 18:55:56','2026-02-07 18:55:56'),(125,'view_all_heure_travail','2026-02-07 18:55:56','2026-02-07 18:55:56'),(126,'create_heure_travail','2026-02-07 18:55:56','2026-02-07 18:55:56'),(127,'update_heure_travail','2026-02-07 18:55:56','2026-02-07 18:55:56'),(128,'delete_heure_travail','2026-02-07 18:55:56','2026-02-07 18:55:56'),(129,'view_all_horaire_exceptionnel','2026-02-07 18:55:56','2026-02-07 18:55:56'),(130,'create_horaire_exceptionnel','2026-02-07 18:55:56','2026-02-07 18:55:56'),(131,'update_horaire_exceptionnel','2026-02-07 18:55:56','2026-02-07 18:55:56'),(132,'delete_horaire_exceptionnel','2026-02-07 18:55:56','2026-02-07 18:55:56'),(133,'view_all_departements','2026-02-07 18:55:56','2026-02-07 18:55:56'),(134,'create_departements','2026-02-07 18:55:56','2026-02-07 18:55:56'),(135,'update_departements','2026-02-07 18:55:56','2026-02-07 18:55:56'),(136,'delete_departements','2026-02-07 18:55:56','2026-02-07 18:55:56'),(137,'view_all_group_motifs','2026-02-07 18:55:56','2026-02-07 18:55:56'),(138,'create_group_motifs','2026-02-07 18:55:56','2026-02-07 18:55:56'),(139,'update_group_motifs','2026-02-07 18:55:56','2026-02-07 18:55:56'),(140,'delete_group_motifs','2026-02-07 18:55:56','2026-02-07 18:55:56'),(141,'view_all_groupe_horaires','2026-02-07 18:55:56','2026-02-07 18:55:56'),(142,'create_groupe_horaires','2026-02-07 18:55:56','2026-02-07 18:55:56'),(143,'update_groupe_horaires','2026-02-07 18:55:56','2026-02-07 18:55:56'),(144,'delete_groupe_horaires','2026-02-07 18:55:56','2026-02-07 18:55:56'),(145,'view_all_group_constantes','2026-02-07 18:55:56','2026-02-07 18:55:56'),(146,'create_group_constantes','2026-02-07 18:55:56','2026-02-07 18:55:56'),(147,'update_group_constantes','2026-02-07 18:55:56','2026-02-07 18:55:56'),(148,'delete_group_constantes','2026-02-07 18:55:56','2026-02-07 18:55:56'),(149,'view_all_group_rubriques','2026-02-07 18:55:56','2026-02-07 18:55:56'),(150,'create_group_rubriques','2026-02-07 18:55:56','2026-02-07 18:55:56'),(151,'update_group_rubriques','2026-02-07 18:55:56','2026-02-07 18:55:56'),(152,'delete_group_rubriques','2026-02-07 18:55:56','2026-02-07 18:55:56'),(153,'view_groupes_paie_details','2026-02-07 18:55:56','2026-02-07 18:55:56'),(154,'create_groupes_paie_details','2026-02-07 18:55:56','2026-02-07 18:55:56'),(155,'update_groupes_paie_details','2026-02-07 18:55:56','2026-02-07 18:55:56'),(156,'delete_groupes_paie_details','2026-02-07 18:55:56','2026-02-07 18:55:56'),(157,'view_bultin_models_details','2026-02-07 18:55:57','2026-02-07 18:55:57'),(158,'create_bultin_models_details','2026-02-07 18:55:57','2026-02-07 18:55:57'),(159,'update_bultin_models_details','2026-02-07 18:55:57','2026-02-07 18:55:57'),(160,'delete_bultin_models_details','2026-02-07 18:55:57','2026-02-07 18:55:57');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',1,'API_TOKEN','300623757b990024e3b735dd2c5fa6b64b2d18ceb0e5dba0e4207484ed7b45f1','[\"*\"]','2026-02-07 19:03:14',NULL,'2026-02-07 18:58:56','2026-02-07 19:03:14'),(2,'App\\Models\\User',1,'API_TOKEN','62c3096503648368b4b3617f492b01e56689f77a3059f774e89805a6e234acb8','[\"*\"]','2026-02-13 08:18:35',NULL,'2026-02-07 19:05:02','2026-02-13 08:18:35');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preparation_commandes`
--

DROP TABLE IF EXISTS `preparation_commandes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preparation_commandes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `CodePreparation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `commande_id` bigint unsigned NOT NULL,
  `status_preparation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `datePreparationCommande` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `preparation_commandes_commande_id_foreign` (`commande_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preparation_commandes`
--

LOCK TABLES `preparation_commandes` WRITE;
/*!40000 ALTER TABLE `preparation_commandes` DISABLE KEYS */;
/*!40000 ALTER TABLE `preparation_commandes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produits`
--

DROP TABLE IF EXISTS `produits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produits` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `Code_produit` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_quantite` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unite` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `seuil_alerte` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stock_initial` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `etat_produit` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `marque` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logoP` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prix_vente` decimal(8,2) DEFAULT NULL,
  `user_id` bigint unsigned NOT NULL,
  `categorie_id` bigint unsigned NOT NULL,
  `calibre_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `produits_code_produit_unique` (`Code_produit`),
  KEY `produits_user_id_foreign` (`user_id`),
  KEY `produits_categorie_id_foreign` (`categorie_id`),
  KEY `produits_calibre_id_foreign` (`calibre_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produits`
--

LOCK TABLES `produits` WRITE;
/*!40000 ALTER TABLE `produits` DISABLE KEYS */;
/*!40000 ALTER TABLE `produits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proprietes`
--

DROP TABLE IF EXISTS `proprietes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proprietes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `imprimable_id` bigint unsigned DEFAULT NULL,
  `mois_cloture_id` bigint unsigned DEFAULT NULL,
  `rappel_salaire_id` bigint unsigned DEFAULT NULL,
  `en_activite` tinyint(1) NOT NULL DEFAULT '0',
  `regularisation` tinyint(1) NOT NULL DEFAULT '0',
  `visible` tinyint(1) NOT NULL DEFAULT '0',
  `exclue_net_payer` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `proprietes_imprimable_id_foreign` (`imprimable_id`),
  KEY `proprietes_mois_cloture_id_foreign` (`mois_cloture_id`),
  KEY `proprietes_rappel_salaire_id_foreign` (`rappel_salaire_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proprietes`
--

LOCK TABLES `proprietes` WRITE;
/*!40000 ALTER TABLE `proprietes` DISABLE KEYS */;
/*!40000 ALTER TABLE `proprietes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rappel_salaires`
--

DROP TABLE IF EXISTS `rappel_salaires`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rappel_salaires` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rappel_salaires`
--

LOCK TABLES `rappel_salaires` WRITE;
/*!40000 ALTER TABLE `rappel_salaires` DISABLE KEYS */;
/*!40000 ALTER TABLE `rappel_salaires` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reclamations`
--

DROP TABLE IF EXISTS `reclamations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reclamations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `client_id` bigint unsigned NOT NULL,
  `sujet` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_reclamation` datetime NOT NULL,
  `status_reclamation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `traitement_reclamation` text COLLATE utf8mb4_unicode_ci,
  `date_traitement` datetime DEFAULT NULL,
  `remarque` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reclamations_client_id_foreign` (`client_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reclamations`
--

LOCK TABLES `reclamations` WRITE;
/*!40000 ALTER TABLE `reclamations` DISABLE KEYS */;
/*!40000 ALTER TABLE `reclamations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regimes_mutuelle`
--

DROP TABLE IF EXISTS `regimes_mutuelle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regimes_mutuelle` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `mutuelle_id` bigint unsigned NOT NULL,
  `libelle` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `taux_couverture` int DEFAULT NULL,
  `cotisation_mensuelle` decimal(10,2) DEFAULT NULL,
  `part_employeur_pct` decimal(5,2) DEFAULT NULL,
  `part_employe_pct` decimal(5,2) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `regimes_mutuelle_mutuelle_id_foreign` (`mutuelle_id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regimes_mutuelle`
--

LOCK TABLES `regimes_mutuelle` WRITE;
/*!40000 ALTER TABLE `regimes_mutuelle` DISABLE KEYS */;
INSERT INTO `regimes_mutuelle` VALUES (1,1,'Régime Général CNSS',70,450.00,70.00,30.00,1,'2026-02-07 18:55:41','2026-02-07 18:55:41'),(2,1,'Régime Cadres CNSS',80,650.00,75.00,25.00,1,'2026-02-07 18:55:41','2026-02-07 18:55:41'),(3,2,'RAMED Basic',90,0.00,100.00,0.00,1,'2026-02-07 18:55:41','2026-02-07 18:55:41'),(4,3,'AMO Standard',70,380.00,65.00,35.00,1,'2026-02-07 18:55:41','2026-02-07 18:55:41'),(5,3,'AMO Plus',85,580.00,70.00,30.00,1,'2026-02-07 18:55:41','2026-02-07 18:55:41'),(6,4,'Régime Fonctionnaires',90,520.00,80.00,20.00,1,'2026-02-07 18:55:41','2026-02-07 18:55:41'),(7,5,'Atlas Essentiel',75,420.00,60.00,40.00,1,'2026-02-07 18:55:41','2026-02-07 18:55:41'),(8,5,'Atlas Premium',95,750.00,65.00,35.00,1,'2026-02-07 18:55:41','2026-02-07 18:55:41');
/*!40000 ALTER TABLE `regimes_mutuelle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regions`
--

DROP TABLE IF EXISTS `regions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `region` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regions`
--

LOCK TABLES `regions` WRITE;
/*!40000 ALTER TABLE `regions` DISABLE KEYS */;
/*!40000 ALTER TABLE `regions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regle_compensation`
--

DROP TABLE IF EXISTS `regle_compensation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regle_compensation` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `frequence_calcul` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `plafond_hn` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regle_compensation`
--

LOCK TABLES `regle_compensation` WRITE;
/*!40000 ALTER TABLE `regle_compensation` DISABLE KEYS */;
/*!40000 ALTER TABLE `regle_compensation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_user`
--

DROP TABLE IF EXISTS `role_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_user` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_user_user_id_role_id_unique` (`user_id`,`role_id`),
  KEY `role_user_role_id_foreign` (`role_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_user`
--

LOCK TABLES `role_user` WRITE;
/*!40000 ALTER TABLE `role_user` DISABLE KEYS */;
INSERT INTO `role_user` VALUES (1,1,1,NULL,NULL);
/*!40000 ALTER TABLE `role_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin','2026-02-07 18:55:54','2026-02-07 18:55:54');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rubriques`
--

DROP TABLE IF EXISTS `rubriques`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rubriques` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `intitule` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_rubrique` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `memo` text COLLATE utf8mb4_unicode_ci,
  `is_complete` tinyint(1) NOT NULL DEFAULT '0',
  `calculs` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gain` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `formule` text COLLATE utf8mb4_unicode_ci,
  `formule_nombre` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `formule_base` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `formule_taux` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `formule_montant` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `report_nombre` tinyint(1) NOT NULL DEFAULT '0',
  `report_base` tinyint(1) NOT NULL DEFAULT '0',
  `report_taux` tinyint(1) NOT NULL DEFAULT '0',
  `report_montant` tinyint(1) NOT NULL DEFAULT '0',
  `impression_nombre` tinyint(1) NOT NULL DEFAULT '0',
  `impression_base` tinyint(1) NOT NULL DEFAULT '0',
  `impression_taux` tinyint(1) NOT NULL DEFAULT '0',
  `impression_montant` tinyint(1) NOT NULL DEFAULT '0',
  `saisie_nombre` tinyint(1) NOT NULL DEFAULT '0',
  `saisie_base` tinyint(1) NOT NULL DEFAULT '0',
  `saisie_taux` tinyint(1) NOT NULL DEFAULT '0',
  `saisie_montant` tinyint(1) NOT NULL DEFAULT '0',
  `group_rubrique_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rubriques_group_rubrique_id_foreign` (`group_rubrique_id`),
  KEY `rubriques_calculs_index` (`calculs`),
  KEY `rubriques_gain_index` (`gain`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rubriques`
--

LOCK TABLES `rubriques` WRITE;
/*!40000 ALTER TABLE `rubriques` DISABLE KEYS */;
/*!40000 ALTER TABLE `rubriques` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_clients`
--

DROP TABLE IF EXISTS `site_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_clients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `CodeSiteclient` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `raison_sociale` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adresse` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tele` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ville` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abreviation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code_postal` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ice` int NOT NULL,
  `logoSC` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `zone_id` bigint unsigned NOT NULL,
  `region_id` bigint unsigned NOT NULL,
  `client_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `site_clients_zone_id_foreign` (`zone_id`),
  KEY `site_clients_region_id_foreign` (`region_id`),
  KEY `site_clients_client_id_foreign` (`client_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_clients`
--

LOCK TABLES `site_clients` WRITE;
/*!40000 ALTER TABLE `site_clients` DISABLE KEYS */;
/*!40000 ALTER TABLE `site_clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status_commandes`
--

DROP TABLE IF EXISTS `status_commandes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status_commandes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_status` timestamp NOT NULL,
  `commande_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `status_commandes_commande_id_foreign` (`commande_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status_commandes`
--

LOCK TABLES `status_commandes` WRITE;
/*!40000 ALTER TABLE `status_commandes` DISABLE KEYS */;
/*!40000 ALTER TABLE `status_commandes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock`
--

DROP TABLE IF EXISTS `stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `produit_id` bigint unsigned NOT NULL,
  `quantite` bigint unsigned NOT NULL,
  `seuil_minimal` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stock_produit_id_foreign` (`produit_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock`
--

LOCK TABLES `stock` WRITE;
/*!40000 ALTER TABLE `stock` DISABLE KEYS */;
/*!40000 ALTER TABLE `stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock__productions`
--

DROP TABLE IF EXISTS `stock__productions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock__productions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `produit_id` bigint unsigned NOT NULL,
  `date` date NOT NULL,
  `quantite` int NOT NULL,
  `n_lot` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_fournisseur` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stock__productions_produit_id_foreign` (`produit_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock__productions`
--

LOCK TABLES `stock__productions` WRITE;
/*!40000 ALTER TABLE `stock__productions` DISABLE KEYS */;
/*!40000 ALTER TABLE `stock__productions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_magasins`
--

DROP TABLE IF EXISTS `stock_magasins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_magasins` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `produit_id` bigint unsigned NOT NULL,
  `date` date NOT NULL,
  `quantite` int NOT NULL,
  `n_lot` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_fournisseur` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stock_magasins_produit_id_foreign` (`produit_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_magasins`
--

LOCK TABLES `stock_magasins` WRITE;
/*!40000 ALTER TABLE `stock_magasins` DISABLE KEYS */;
/*!40000 ALTER TABLE `stock_magasins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type_constantes`
--

DROP TABLE IF EXISTS `type_constantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type_constantes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type_constantes`
--

LOCK TABLES `type_constantes` WRITE;
/*!40000 ALTER TABLE `type_constantes` DISABLE KEYS */;
/*!40000 ALTER TABLE `type_constantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type_rubriques`
--

DROP TABLE IF EXISTS `type_rubriques`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type_rubriques` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type_rubriques`
--

LOCK TABLES `type_rubriques` WRITE;
/*!40000 ALTER TABLE `type_rubriques` DISABLE KEYS */;
/*!40000 ALTER TABLE `type_rubriques` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `types_calculs`
--

DROP TABLE IF EXISTS `types_calculs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `types_calculs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `designation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `modele_formule` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `champs_requis` json NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `exemple` text COLLATE utf8mb4_unicode_ci,
  `ordre` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `categorie` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'standard',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `types_calculs_designation_unique` (`designation`),
  KEY `types_calculs_is_active_ordre_index` (`is_active`,`ordre`),
  KEY `types_calculs_categorie_index` (`categorie`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `types_calculs`
--

LOCK TABLES `types_calculs` WRITE;
/*!40000 ALTER TABLE `types_calculs` DISABLE KEYS */;
/*!40000 ALTER TABLE `types_calculs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin User','admin@example.com',NULL,'admin1234',NULL,NULL,'2026-02-07 18:55:57','2026-02-07 18:55:57');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicule_livreurs`
--

DROP TABLE IF EXISTS `vehicule_livreurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicule_livreurs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `livreur_id` bigint unsigned NOT NULL,
  `vehicule_id` bigint unsigned NOT NULL,
  `date_debut_affectation` date NOT NULL,
  `date_fin_affectation` date DEFAULT NULL,
  `kilometrage_debut` int NOT NULL,
  `kilometrage_fin` int DEFAULT NULL,
  `heure` time NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `vehicule_livreurs_livreur_id_foreign` (`livreur_id`),
  KEY `vehicule_livreurs_vehicule_id_foreign` (`vehicule_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicule_livreurs`
--

LOCK TABLES `vehicule_livreurs` WRITE;
/*!40000 ALTER TABLE `vehicule_livreurs` DISABLE KEYS */;
/*!40000 ALTER TABLE `vehicule_livreurs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicules`
--

DROP TABLE IF EXISTS `vehicules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicules` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `marque` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `matricule` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacite` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `vehicules_matricule_unique` (`matricule`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicules`
--

LOCK TABLES `vehicules` WRITE;
/*!40000 ALTER TABLE `vehicules` DISABLE KEYS */;
/*!40000 ALTER TABLE `vehicules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vis`
--

DROP TABLE IF EXISTS `vis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vis` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `date_visite` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `commentaire` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vehicule_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vis`
--

LOCK TABLES `vis` WRITE;
/*!40000 ALTER TABLE `vis` DISABLE KEYS */;
/*!40000 ALTER TABLE `vis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zones`
--

DROP TABLE IF EXISTS `zones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `zones` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `zone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zones`
--

LOCK TABLES `zones` WRITE;
/*!40000 ALTER TABLE `zones` DISABLE KEYS */;
/*!40000 ALTER TABLE `zones` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-13 10:34:33
