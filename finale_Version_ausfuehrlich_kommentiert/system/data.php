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
// Der Funktion benötigt zwei Parameter, die E-Mail-Adresse und das Passwort des user.
function login($email, $passwort){
	// Wir stellen über die Funktion dbVerbindungErzeugen() (siehe oben) eine DB-Verbindung her
	//   und speichern sie in der Variablen $db.
	//   ($db ist ein Objekt der PDO-Klasse, welche von PHP zur verfügung gestellt wird.)
	$db = dbVerbindungErzeugen();

	// Wir formulieren die SQL-Abfrage und speichern sie in der Variablen $sql.

	//       !!!!! ACHTUNG !!!!!
	// !!!!! Die direkte Formulierung als SQL-Statement ist aus Sicherheitsgründen nicht zu  empfehlen.
	// !!!!! PDO stellt sog. perpared Statements zur Verfügung.
	// !!!!! Sie verhindern wirkungsvoll Hackerangriffe SQL-Injections.
	// !!!!! Siehe: https://www.php-einfach.de/mysql-tutorial/php-prepared-statements/
	// !!!!! Siehe: https://phpdelusions.net/pdo#prepared
	$sql = "SELECT * FROM user WHERE email='$email' AND passwort='$passwort';";

	// Mit der query()-Methode schicken wir die SQL-Abfrage an die DB und
	//   speichern das Ergebnis in der Variablen $resultat.
	$resultat = $db->query($sql);

	// Die Methode rowCount() liefert die Anzahl der Ergebnisse zurück.
	// Für einen erfolgreichen Login muss genau ein Ergebnis zurückgegeben werden.
	if($resultat->rowCount() == 1){    // Wenn es genau ein Ergebnis gibt ...
		// ... wandeln wir mit der fetch()-Methode das Ergebnis in ein assoziatives Array um
		//   und speichern es in der Variablen $zeilenArray.
		// Die Bezeichner des Assoziativen Arrays sind die Namen der Datenbankspalten der Tabelle user.
		$zeilenArray = $resultat->fetch();

		// Den Wert aus $zeilenArray geben wir als Ergebnis der Funktion zurück.
		return $zeilenArray;
	}else{          // Wenn es mehr oder weniger als genau ein Ergebnis gibt ...
		// ... geben wir als Ergebnis der Fuktion den Wert false zurück.
		return false;
	}
}


// Registrieren
/* Neue Benutzerdaten werden in die User Datenbank gespeichert */
function userSpeichern($email, $passwort, $vorname, $nachname){
	$db = dbVerbindungErzeugen();  // DB-Verbindung herstellen (s. login())
	// Das PHP-Datenbank-Interface PDO stellt sog. prpared statements zur Verfügung.
	// siehe: https://www.php-einfach.de/mysql-tutorial/crashkurs-pdo/
	// Dabei stehen im SQL-Statement Fragezeichen als Platzhalter für die zu übertragenden Werte.
	$sql = "INSERT INTO user (email, passwort, vorname, nachname) VALUES (?, ?, ?, ?);";
	// Im folgenden Schritt wird das Statement mit $db->prepare($sql) vorbereitet und in einer Variablen gespeichert.
	$stmt = $db->prepare($sql);
	// Mit der execute()-Methode wird die Abfrage ausgeführt.
	// Dabei müssen die einzusetzenden Werte als Array übermittelt werden.
	// Innerhalb des Arrays müssen die Werte die richtige Reihenfolge haben.
	// Da es sich bei dem Statement um einen INSERT-Befehl handelt,
	//   wird als Ergebnis true fur eine erfolgreiche Speicherung
	//   und false für eine misslungene Speicherung zurückgegeben
	return $stmt->execute(array($email, $passwort, $vorname, $nachname));
}



// Überprüfung, ob die E-Mail-Adresse in der Tabelle user vorhanden ist.
function existiertEmail($email){
	$db = dbVerbindungErzeugen(); // DB-Verbindung herstellen (s. login())
	$sql = "SELECT * FROM user where email = '$email';";
	$resultat = $db->query($sql);
	if($resultat->rowCount() > 0){
		return true;
	};
	return false;
}
