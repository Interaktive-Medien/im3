<?php
// data.php laden (für DB-Verbindung)
require_once('../data.php');

$db = dbVerbindungErzeugen(); // in data.php
// SQL-Variable als String zusammenstellen
$sql = "SELECT * FROM beitraege WHERE uebergeordnete_id = 0;";
// SQL-Variable an Datenbank schicken und Ergebnist in Variable $resultat speichern
$resultat = $db->query($sql);
// Alle Datensätze aus $resultat in ein assoziatives Array umwandeln
// und in $resultatArray speichern
$resultatArray = $resultat->fetchAll();

// Inhalt des Arrays als JSON ausgeben
echo json_encode($resultatArray);
?>
