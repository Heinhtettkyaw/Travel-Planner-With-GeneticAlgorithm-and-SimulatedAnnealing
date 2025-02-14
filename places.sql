-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 13, 2025 at 09:08 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tp_test3`
--

-- --------------------------------------------------------

--
-- Table structure for table `places`
--

CREATE TABLE `places` (
  `id` bigint(20) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `name` varchar(255) NOT NULL,
  `city_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `places`
--

INSERT INTO `places` (`id`, `category`, `latitude`, `longitude`, `name`, `city_id`) VALUES
(1, 'ATTRACTION', 40.758, -73.9855, 'Times Square', 1),
(2, 'ATTRACTION', 40.748817, -73.985428, 'Empire State Building', 1),
(3, 'ATTRACTION', 40.785091, -73.968285, 'Central Park', 1),
(4, 'HOTEL', 40.7625, -73.978, 'Hilton Midtown', 1),
(5, 'HOTEL', 40.7644, -73.974, 'The Plaza Hotel', 1),
(6, 'RESTAURANT', 40.7411, -73.9897, 'Shake Shack', 1),
(7, 'ATTRACTION', 34.134115, -118.321548, 'Hollywood Sign', 2),
(8, 'ATTRACTION', 34.138117, -118.353378, 'Universal Studios Hollywood', 2),
(9, 'ATTRACTION', 34.0094, -118.4973, 'Santa Monica Pier', 2),
(10, 'HOTEL', 34.088, -118.4068, 'The Beverly Hills Hotel', 2),
(11, 'HOTEL', 34.0587, -118.4158, 'The Ritz-Carlton, Los Angeles', 2),
(12, 'RESTAURANT', 34.0522, -118.2437, 'In-N-Out Burger', 2),
(13, 'ATTRACTION', 41.8827, -87.6233, 'Millennium Park', 3),
(14, 'ATTRACTION', 41.8789, -87.6359, 'Willis Tower', 3),
(15, 'ATTRACTION', 41.8916, -87.6079, 'Navy Pier', 3),
(16, 'HOTEL', 41.8926, -87.6286, 'Palmer House Hilton', 3),
(17, 'HOTEL', 41.892, -87.634, 'The Langham, Chicago', 3),
(18, 'RESTAURANT', 41.8937, -87.6354, 'Giordano\'s', 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `places`
--
ALTER TABLE `places`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKn1di3fddbxax9y45on6hj2gue` (`city_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `places`
--
ALTER TABLE `places`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `places`
--
ALTER TABLE `places`
  ADD CONSTRAINT `FKn1di3fddbxax9y45on6hj2gue` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
