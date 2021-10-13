<?php
// data.php laden (für DB-Verbindung)
require_once('../data.php');

// Kontrollieren, ob alle benötigten Werte im $_POST-Array vorhanden sind
// und Werte in Variablen speichern
if(isset($_POST['titel'])){
  $titel = $_POST['titel'];
}
if(isset($_POST['inhalt'])){
  $inhalt = $_POST['inhalt'];
}
if(isset($_POST['userId'])){
  $userId = $_POST['userId'];
}
if(isset($_POST['uebergeordneteId'])){
  $uebergeordneteId = $_POST['uebergeordneteId'];
}

$db = dbVerbindungErzeugen(); // in data.php

// SQL-Variable für Prepared Statement (PDO) zum speichern eines neuen Beitrags als String zusammenstellen
// Fragezeichen werden später durch Werte ersetzt
$sql = "INSERT INTO beitraege (titel, inhalt, uebergeordnete_id, autor_id) VALUES (?,?,?,?);";
//  Prepared Statement mit SQL-Variable vorbereiten und in Variable $stmt speichern
$stmt = $db->prepare($sql);
// Prepared Statement mit array aus Variablenwerten ausführen.
// (Werte müssen als Array übergeben werden und ersetzt Fragezeichen in $sql-Variable)
// Reihenfolge der Variablenwerte muss der Reihenfolge der Fragezeichen in SQL-Variablen entsprechen.
$stmt->execute(array($titel, $inhalt, $uebergeordneteId, $userId));

// mit lastInsertId() die DB-id des neuen Beitrags ermitteln und ausgeben
echo $db->lastInsertId();
?>
