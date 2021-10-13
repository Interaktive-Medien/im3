<?php
// data.php laden (für DB-Verbindung)
require_once('../data.php');

// Wenn im $_POST-Array der Bezeichner 'beitragID' vorhanden ist ...
if(isset($_POST['beitragID'])){
  // ... Wert aus $_POST['beitragID'] in Variable $beitragID speichern
  $beitragID = $_POST['beitragID'];

  $db = dbVerbindungErzeugen(); // in data.php

  // SQL-Variable für Prepared Statement (PDO) zum löschen aller Antwortbeiträge zu einer Frage
  // (uebergeordnete_id ist id der Frage) zusammenstellen
  $antwortenLoeschenSql = "DELETE FROM beitraege WHERE uebergeordnete_id = ?;";
  //  Prepared Statement mit SQL-Variable vorbereiten und in Variable $antwortenLoeschenStmt speichern
  $antwortenLoeschenStmt = $db->prepare($antwortenLoeschenSql);
  // Prepared Statement mit array aus Variablenwert ausführen.
  // (Wert muss als Array übergeben werden und ersetzt Fragezeichen in $antwortenLoeschenSql-Variable)
  $antwortenLoeschenStmt->execute(array($beitragID));

  // SQL-Variable für Prepared Statement (PDO) zum löschen eines Fragebeitrags
  // (id ist $beitragID) zusammenstellen
  $frageLoeschenSql = "DELETE FROM beitraege WHERE id = ?;";
  //  Prepared Statement mit SQL-Variable vorbereiten und in Variable $frageLoeschenStmt speichern
  $frageLoeschenStmt = $db->prepare($frageLoeschenSql);
  // Prepared Statement mit array aus Variablenwert ausführen.
  // (Wert muss als Array übergeben werden und ersetzt Fragezeichen in $antwortenLoeschenSql-Variable)
  // Ergebnin in Variable $resultat speichern
	$resultat = $frageLoeschenStmt->execute(array($beitragID));

  echo $resultat;


// Wenn im $_POST-Array derBezeichner 'beitragID' NICHT vorhanden ist ...
}else{
  // false ausgeben
  echo false;
}
?>
