<?php

// Die Variablen $db_host, $db_name, $db_user, $db_pass, $db_charset sind in config.php zentral gespeichert.
require_once($_SERVER['DOCUMENT_ROOT'].'/config.php');

// Datenbank Verbindung aufbauen
// Siehe: https://www.php-einfach.de/mysql-tutorial/crashkurs-pdo/
// Siehe: https://www.php-einfach.de/mysql-tutorial/verbindung-aufbauen/
// Siehe: https://phpdelusions.net/pdo#dsn

function dbVerbindungErzeugen(){

	/* Die in config.php festgelegten Variablen gelten innerhalb einer Funktion standardmässig NICHT.
	Um sie innerhalb einer Funktion zugänglich zu machen, müssen sie mit dem Schlüsselwort global innerhalb der Funktion gekennzeichnet werden.
	Siehe: https://www.php.net/manual/de/language.variables.scope.php
	*/
	global $db_host, $db_name, $db_user, $db_pass, $db_charset;

	$dsn = "mysql:host=$db_host;dbname=$db_name;charset=$db_charset"; // siehe https://en.wikipedia.org/wiki/Data_source_name
	$options = [
		PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
		PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
		PDO::ATTR_EMULATE_PREPARES   => false
	];

	// Einfache Version der DB-Verbindung
	//$db = new PDO($dsn, $user, $pass, $options);

	// Ausführliche Version der DB-Verbindung
	try {
		$db = new PDO($dsn, $db_user, $db_pass, $options);
	} catch (\PDOException $e) {
		throw new \PDOException($e->getMessage(), (int)$e->getCode());
	}

	// Wir geben die in der Variablen $db gespeicherte Datenbankverbindung
	//   als Ergebnis der Funktion zurück.
	return $db;
}




// Einloggen
function login($email, $passwort){
	$db = dbVerbindungErzeugen();

	$sql = "SELECT * FROM user WHERE email='$email' AND passwort='$passwort';";

	$resultat = $db->query($sql);

	if($resultat->rowCount() == 1){
		$zeilenArray = $resultat->fetch();
		return $zeilenArray;
	}else{
		return false;
	}
}



// Registrieren
// Überprüfung, ob die E-Mail-Adresse in der Tabelle user vorhanden ist.
// SELECT * FROM user where email = '$email';


/* Neue Benutzerdaten werden in die User Datenbank gespeichert */
// INSERT INTO user (email, passwort, vorname, nachname) VALUES (?, ?, ?, ?);
