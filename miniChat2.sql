-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : dim. 14 jan. 2024 à 23:30
-- Version du serveur : 8.0.35-0ubuntu0.22.04.1
-- Version de PHP : 8.1.2-1ubuntu2.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `miniChat`
--

-- --------------------------------------------------------

--
-- Structure de la table `chatroom`
--

CREATE TABLE `chatroom` (
  `id` int NOT NULL,
  `name` varchar(15) COLLATE utf8mb4_general_ci NOT NULL,
  `cr_user` int NOT NULL,
  `dt_create` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `color` varchar(6) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'e06666',
  `private` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `chatroom`
--

INSERT INTO `chatroom` (`id`, `name`, `cr_user`, `dt_create`, `color`, `private`) VALUES
(1, 'default', 1, '2024-01-10 09:24:54', 'e06666', 1);

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `id` int NOT NULL,
  `m_user` int NOT NULL,
  `m_chatroom` int NOT NULL,
  `content` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `ip` varchar(12) COLLATE utf8mb4_general_ci NOT NULL,
  `user_agent` varchar(127) COLLATE utf8mb4_general_ci NOT NULL,
  `dt_msg` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `lastname` varchar(63) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `firstname` varchar(63) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pseudo` varchar(31) COLLATE utf8mb4_general_ci NOT NULL,
  `pw` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `color` varchar(6) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'e06666',
  `dt_registration` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `lastname`, `firstname`, `pseudo`, `pw`, `color`, `dt_registration`) VALUES
(1, 'default_lastname', 'default_firstname', 'default', '', 'e06666', '2024-01-10 09:24:19'),
(21, NULL, NULL, 'adam', 'adam', 'e06666', '2024-01-12 14:20:38'),
(22, 'adam', NULL, 'ouioui', 'oui', 'e06666', '2024-01-14 21:30:29');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `chatroom`
--
ALTER TABLE `chatroom`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chatroom_user_fk` (`cr_user`);

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `messages_chatroom_fk` (`m_chatroom`),
  ADD KEY `messages_users_fk` (`m_user`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pseudo` (`pseudo`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `chatroom`
--
ALTER TABLE `chatroom`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `chatroom`
--
ALTER TABLE `chatroom`
  ADD CONSTRAINT `chatroom_user_fk` FOREIGN KEY (`cr_user`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_chatroom_fk` FOREIGN KEY (`m_chatroom`) REFERENCES `chatroom` (`id`),
  ADD CONSTRAINT `messages_users_fk` FOREIGN KEY (`m_user`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
