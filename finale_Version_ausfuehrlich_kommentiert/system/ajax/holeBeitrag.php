<?php
// data.php laden (für DB-Verbindung)
require_once('../data.php');

// Wenn im $_POST-Array der Bezeichner 'beitragID' vorhanden ist ...
if(isset($_GET['beitragID'])){
  // ... Wert aus $_POST['beitragID'] in Variable $beitragID speichern
  $beitragID = $_GET['beitragID'];

  $db = dbVerbindungErzeugen(); // in data.php
  // SQL-Variable für einzelnen Beitrag
  // (id=$beitragID) als String zusammenstellen
	$sql = "SELECT * FROM beitraege WHERE id = $beitragID;";
  // SQL-Variable an Datenbank schicken und Ergebnis in Variable $resultat speichern
	$resultat = $db->query($sql);
  // den ersten (und einzigen) Datensatz aus $resultat
  // in ein assoziatives Array umwandeln und in $resultatArray speichern
	$resultatArray = $resultat->fetch();


  // Inhalt des Arrays als JSON ausgeben
  echo json_encode($resultatArray);

// Wenn im $_POST-Array derBezeichner 'beitragID' NICHT vorhanden ist ...
}else{
  // false ausgeben
  echo false;
}
?>
