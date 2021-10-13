<?php
// data.php laden (für DB-Verbindung)
require_once('../data.php');

// Wenn im $_POST-Array der Bezeichner 'beitragID' vorhanden ist ...
if(isset($_POST['beitragID'])){
  // ... Wert aus $_POST['beitragID'] in Variable $beitragID speichern
  $beitragID = $_POST['beitragID'];
  // Wenn im $_POST-Array der  Bezeichner 'titel' vorhanden ist ...
  if(isset($_POST['titel'])){
    // ... Wert aus $_POST['titel'] in Variable $titel speichern
    $titel = $_POST['titel'];
  }
  // Wenn im $_POST-Array der  Bezeichner 'inhalt' vorhanden ist ...
  if(isset($_POST['inhalt'])){
    // ... Wert aus $_POST['inhalt'] in Variable $inhalt speichern
    $inhalt = $_POST['inhalt'];
  }

  $db = dbVerbindungErzeugen(); // in data.php
  // SQL-Variable für Prepared Statement (PDO) als String zusammenstellen
  // Fragezeichen werden später durch Werte ersetzt
	$sql = "UPDATE beitraege SET titel=?, inhalt=? WHERE id=?;";
  //  Prepared Statement mit SQL-Variable vorbereiten und in Variable $stmt speichern
	$stmt = $db->prepare($sql);
  // Prepared Statement mit array aus Variablenwerten ausführen.
  // (Werte müssen als Array übergeben werden und ersetzt Fragezeichen in $sql-Variable)
  // Reihenfolge der Variablenwerte muss der Reihenfolge der Fragezeichen in SQL-Variablen entsprechen.
  // Ergebnin in Variable $resultat speichern
	$resultat = $stmt->execute(array($titel, $inhalt, $beitragID));

  // Inhalt der Variablen $resultat ausgeben
  echo $resultat;

// Wenn im $_POST-Array derBezeichner 'beitragID' NICHT vorhanden ist ...
}else{
  // false ausgeben
  echo false;
}
?>
