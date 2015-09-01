-- MySQL dump 10.13  Distrib 5.1.56, for redhat-linux-gnu (x86_64)
--
-- Host: localhost    Database: Lexis_Link_Monitoring_week13
-- ------------------------------------------------------
-- Server version	5.1.56

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `banking_finance`
--

DROP TABLE IF EXISTS `banking_finance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `banking_finance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `external_link_label` varchar(500) DEFAULT NULL,
  `topic_tree_location` varchar(500) DEFAULT NULL,
  `external_link_address` text,
  `response` varchar(255) DEFAULT NULL,
  `response_category` varchar(255) DEFAULT NULL,
  `ping_date_time` varchar(255) DEFAULT NULL,
  `redirect_url` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banking_finance`
--

LOCK TABLES `banking_finance` WRITE;
/*!40000 ALTER TABLE `banking_finance` DISABLE KEYS */;
/*!40000 ALTER TABLE `banking_finance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_law`
--

DROP TABLE IF EXISTS `business_law`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `business_law` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `external_link_label` varchar(500) DEFAULT NULL,
  `topic_tree_location` varchar(500) DEFAULT NULL,
  `external_link_address` text,
  `response` varchar(255) DEFAULT NULL,
  `response_category` varchar(255) DEFAULT NULL,
  `ping_date_time` varchar(255) DEFAULT NULL,
  `redirect_url` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_law`
--

LOCK TABLES `business_law` WRITE;
/*!40000 ALTER TABLE `business_law` DISABLE KEYS */;
/*!40000 ALTER TABLE `business_law` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `california_business_entity_selection_formation`
--

DROP TABLE IF EXISTS `california_business_entity_selection_formation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `california_business_entity_selection_formation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `external_link_label` varchar(500) DEFAULT NULL,
  `topic_tree_location` varchar(500) DEFAULT NULL,
  `external_link_address` text,
  `response` varchar(255) DEFAULT NULL,
  `response_category` varchar(255) DEFAULT NULL,
  `ping_date_time` varchar(255) DEFAULT NULL,
  `redirect_url` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `california_business_entity_selection_formation`
--

LOCK TABLES `california_business_entity_selection_formation` WRITE;
/*!40000 ALTER TABLE `california_business_entity_selection_formation` DISABLE KEYS */;
/*!40000 ALTER TABLE `california_business_entity_selection_formation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `combined_california_general_business_law`
--

DROP TABLE IF EXISTS `combined_california_general_business_law`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `combined_california_general_business_law` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `external_link_label` varchar(500) DEFAULT NULL,
  `topic_tree_location` varchar(500) DEFAULT NULL,
  `external_link_address` text,
  `response` varchar(255) DEFAULT NULL,
  `response_category` varchar(255) DEFAULT NULL,
  `ping_date_time` varchar(255) DEFAULT NULL,
  `redirect_url` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `combined_california_general_business_law`
--

LOCK TABLES `combined_california_general_business_law` WRITE;
/*!40000 ALTER TABLE `combined_california_general_business_law` DISABLE KEYS */;
/*!40000 ALTER TABLE `combined_california_general_business_law` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commercial_bankrtupcy`
--

DROP TABLE IF EXISTS `commercial_bankrtupcy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `commercial_bankrtupcy` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `external_link_label` varchar(500) DEFAULT NULL,
  `topic_tree_location` varchar(500) DEFAULT NULL,
  `external_link_address` text,
  `response` varchar(255) DEFAULT NULL,
  `response_category` varchar(255) DEFAULT NULL,
  `ping_date_time` varchar(255) DEFAULT NULL,
  `redirect_url` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commercial_bankrtupcy`
--

LOCK TABLES `commercial_bankrtupcy` WRITE;
/*!40000 ALTER TABLE `commercial_bankrtupcy` DISABLE KEYS */;
/*!40000 ALTER TABLE `commercial_bankrtupcy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `corporate_counsel`
--

DROP TABLE IF EXISTS `corporate_counsel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `corporate_counsel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `external_link_label` varchar(500) DEFAULT NULL,
  `topic_tree_location` varchar(500) DEFAULT NULL,
  `external_link_address` text,
  `response` varchar(255) DEFAULT NULL,
  `response_category` varchar(255) DEFAULT NULL,
  `ping_date_time` varchar(255) DEFAULT NULL,
  `redirect_url` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `corporate_counsel`
--

LOCK TABLES `corporate_counsel` WRITE;
/*!40000 ALTER TABLE `corporate_counsel` DISABLE KEYS */;
/*!40000 ALTER TABLE `corporate_counsel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `intellectual_property`
--

DROP TABLE IF EXISTS `intellectual_property`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `intellectual_property` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `external_link_label` varchar(500) DEFAULT NULL,
  `topic_tree_location` varchar(500) DEFAULT NULL,
  `external_link_address` text,
  `response` varchar(255) DEFAULT NULL,
  `response_category` varchar(255) DEFAULT NULL,
  `ping_date_time` varchar(255) DEFAULT NULL,
  `redirect_url` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `intellectual_property`
--

LOCK TABLES `intellectual_property` WRITE;
/*!40000 ALTER TABLE `intellectual_property` DISABLE KEYS */;
/*!40000 ALTER TABLE `intellectual_property` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `labor_employment`
--

DROP TABLE IF EXISTS `labor_employment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `labor_employment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `external_link_label` varchar(500) DEFAULT NULL,
  `topic_tree_location` varchar(500) DEFAULT NULL,
  `external_link_address` text,
  `response` varchar(255) DEFAULT NULL,
  `response_category` varchar(255) DEFAULT NULL,
  `ping_date_time` varchar(255) DEFAULT NULL,
  `redirect_url` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `labor_employment`
--

LOCK TABLES `labor_employment` WRITE;
/*!40000 ALTER TABLE `labor_employment` DISABLE KEYS */;
/*!40000 ALTER TABLE `labor_employment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_a`
--

DROP TABLE IF EXISTS `m_a`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `m_a` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `external_link_label` varchar(500) DEFAULT NULL,
  `topic_tree_location` varchar(500) DEFAULT NULL,
  `external_link_address` text,
  `response` varchar(255) DEFAULT NULL,
  `response_category` varchar(255) DEFAULT NULL,
  `ping_date_time` varchar(255) DEFAULT NULL,
  `redirect_url` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_a`
--

LOCK TABLES `m_a` WRITE;
/*!40000 ALTER TABLE `m_a` DISABLE KEYS */;
/*!40000 ALTER TABLE `m_a` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ny_business_commercial`
--

DROP TABLE IF EXISTS `ny_business_commercial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ny_business_commercial` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `external_link_label` varchar(500) DEFAULT NULL,
  `topic_tree_location` varchar(500) DEFAULT NULL,
  `external_link_address` text,
  `response` varchar(255) DEFAULT NULL,
  `response_category` varchar(255) DEFAULT NULL,
  `ping_date_time` varchar(255) DEFAULT NULL,
  `redirect_url` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ny_business_commercial`
--

LOCK TABLES `ny_business_commercial` WRITE;
/*!40000 ALTER TABLE `ny_business_commercial` DISABLE KEYS */;
/*!40000 ALTER TABLE `ny_business_commercial` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `real_estate`
--

DROP TABLE IF EXISTS `real_estate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `real_estate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `external_link_label` varchar(500) DEFAULT NULL,
  `topic_tree_location` varchar(500) DEFAULT NULL,
  `external_link_address` text,
  `response` varchar(255) DEFAULT NULL,
  `response_category` varchar(255) DEFAULT NULL,
  `ping_date_time` varchar(255) DEFAULT NULL,
  `redirect_url` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `real_estate`
--

LOCK TABLES `real_estate` WRITE;
/*!40000 ALTER TABLE `real_estate` DISABLE KEYS */;
/*!40000 ALTER TABLE `real_estate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `securities_capital_markets`
--

DROP TABLE IF EXISTS `securities_capital_markets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `securities_capital_markets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `external_link_label` varchar(500) DEFAULT NULL,
  `topic_tree_location` varchar(500) DEFAULT NULL,
  `external_link_address` text,
  `response` varchar(255) DEFAULT NULL,
  `response_category` varchar(255) DEFAULT NULL,
  `ping_date_time` varchar(255) DEFAULT NULL,
  `redirect_url` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `securities_capital_markets`
--

LOCK TABLES `securities_capital_markets` WRITE;
/*!40000 ALTER TABLE `securities_capital_markets` DISABLE KEYS */;
/*!40000 ALTER TABLE `securities_capital_markets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `texas_business_commercial`
--

DROP TABLE IF EXISTS `texas_business_commercial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `texas_business_commercial` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `external_link_label` varchar(500) DEFAULT NULL,
  `topic_tree_location` varchar(500) DEFAULT NULL,
  `external_link_address` text,
  `response` varchar(255) DEFAULT NULL,
  `response_category` varchar(255) DEFAULT NULL,
  `ping_date_time` varchar(255) DEFAULT NULL,
  `redirect_url` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `texas_business_commercial`
--

LOCK TABLES `texas_business_commercial` WRITE;
/*!40000 ALTER TABLE `texas_business_commercial` DISABLE KEYS */;
/*!40000 ALTER TABLE `texas_business_commercial` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-08-14 10:02:43
