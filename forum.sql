-- phpMyAdmin SQL Dump
-- version 4.6.6deb4
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Erstellungszeit: 07. Okt 2020 um 14:24
-- Server-Version: 10.1.41-MariaDB-0+deb9u1
-- PHP-Version: 7.0.33-0+deb9u6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `539197_24_1`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `beitraege`
--

CREATE TABLE `beitraege` (
  `id` int(11) UNSIGNED NOT NULL,
  `titel` varchar(255) NOT NULL DEFAULT '',
  `inhalt` text NOT NULL,
  `autor_id` int(11) UNSIGNED NOT NULL DEFAULT '0',
  `uebergeordnete_id` int(11) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `beitraege`
--

INSERT INTO `beitraege` (`id`, `titel`, `inhalt`, `autor_id`, `uebergeordnete_id`) VALUES
(1, 'Lorem Ipsum?', 'Was ist «Lorem Ipsum»?', 0, 0),
(2, 'Lorem Ipsum ', 'ist ein Blindtext, der nichts bedeuten soll, sondern als Platzhalter im Layout verwendet wird, um einen Eindruck vom fertigen Dokument zu erhalten.', 1, 1),
(3, 'Herkunft', 'Der Text selbst ist kein richtiges Latein, schon das erste Wort „Lorem“ existiert dort nicht. Dennoch erkennt man im Text eine Reihe lateinischer Wörter, die aus dem sehr ähnlichen Absatz 1.10.32 bis 1.10.33 aus Ciceros De finibus bonorum et malorum stammen.', 3, 1),
(8, 'MMP', 'Was bedeutet MMP und was ist das überhaupt?', 1, 0),
(9, 'Dialekte in der Schweiz', 'Wie viele verschiedene Dialekte gibt es in der Deutschschweiz?', 2, 0),
(14, 'Viele', 'Auf diese oft gestellte Frage gibt es leider keine eindeutige Antwort.', 3, 9),
(17, 'PHP', 'Was bedeutet PHP und was ist das überhaupt?', 3, 0),
(20, 'Versuch einer Gliederung', 'Die schweizerdeutschen Dialekte unterscheiden sich zum Teil relativ stark voneinander. Überspitzt gesagt hat beinahe jede Region, teilweise sogar jede Gemeinde, lokalspezifische Eigenheiten in ihrem Dialekt. Deutschschweizer kann man zum Teil alleine nach ihrem Dialekt recht genau einer Heimatgegend zuordnen.\r\n\r\nVolkstümlich werden die Dialekte nach den jeweiligen Kantonen gegliedert; man unterscheidet so unter anderem Baseldeutsch, Berndeutsch, Zürichdeutsch, Solothurnerdeutsch, Senslerdeutsch, Urnerdeutsch, Glarnerdeutsch, Walliserdeutsch, Bündnerdeutsch, Appenzellerdeutsch oder St.-Galler-Deutsch. Dialektologisch gesehen treffen diese Charakterisierungen nur in Einzelfällen wirklich zu; so bilden etwa Berndeutsch, St.-Galler-Deutsch oder Bündnerdeutsch keineswegs Einheiten, und umgekehrt sind die Unterschiede zwischen z. B. nördlichem St.-Galler-Deutsch, Thurgauerdeutsch und Schaffhauserdeutsch sehr gering. Ohnehin findet sich nur in wenigen Fällen ein Merkmal, das nur in einer bestimmten Region vorkommt und sie von allen anderen abgrenzen würde.', 1, 9),
(21, 'Beispiel', 'Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 0, 1),
(22, 'PHP Bedeutung', 'Ist ein rekursives Akronym und Backronym für „PHP: Hypertext Preprocessor“, ursprünglich „Personal Home Page Tools“.', 2, 17),
(26, 'PHP - was ist das', 'PHP ist eine Skriptsprache mit einer an C und Perl angelehnten Syntax, die hauptsächlich zur Erstellung dynamischer Webseiten oder Webanwendungen verwendet wird. PHP wird als freie Software unter der PHP-Lizenz verbreitet. PHP zeichnet sich durch breite Datenbankunterstützung und Internet-Protokolleinbindung sowie die Verfügbarkeit zahlreicher Funktionsbibliotheken aus.', 0, 17);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE `user` (
  `id` int(11) UNSIGNED NOT NULL,
  `passwort` varchar(24) NOT NULL DEFAULT '',
  `email` varchar(100) NOT NULL DEFAULT '',
  `vorname` varchar(100) NOT NULL DEFAULT '',
  `nachname` varchar(100) NOT NULL DEFAULT '',
  `registrier_zeit` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`id`, `passwort`, `email`, `vorname`, `nachname`, `registrier_zeit`) VALUES
(1, '12345', 'alina.weisser@mmpforum.ch', 'Alina', 'Weisser', '2017-07-18 11:35:18'),
(2, '54321', 'wolfgang.bock@htwchur.ch', 'Wolfgang', 'Bock', '2017-07-18 20:43:07'),
(3, '1111', 'urs@thoeny.ch', 'Urs', 'Thöny', '2017-07-19 09:44:52');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `beitraege`
--
ALTER TABLE `beitraege`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uebergeordnetIndex` (`uebergeordnete_id`);

--
-- Indizes für die Tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `beitraege`
--
ALTER TABLE `beitraege`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
--
-- AUTO_INCREMENT für Tabelle `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
