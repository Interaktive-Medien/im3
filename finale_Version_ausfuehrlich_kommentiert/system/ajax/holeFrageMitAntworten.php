<?php
// data.php laden (für DB-Verbindung)
require_once('../data.php');

// Wenn im $_POST-Array der Bezeichner 'beitragID' vorhanden ist ...
if(isset($_GET['beitragID'])){
  // ... Wert aus $_POST['beitragID'] in Variable $beitragID speichern
  $beitragID = $_GET['beitragID'];

  $db = dbVerbindungErzeugen(); // in data.php

// FRAGE HOLEN
  // SQL-Variable für einzelnen Fragebeitrag
  // (id=$beitragID) als String zusammenstellen
	$sql = "SELECT * FROM beitraege WHERE id=$beitragID;";
  // SQL-Variable an Datenbank schicken und Ergebnist in Variable $frageResultat speichern
	$frageResultat = $db->query($sql);
  // den ersten (und einzigen) Datensatz aus $resultat
  // in ein assoziatives Array umwandeln und in $frageatArray speichern
	$frageArray = $frageResultat->fetch();

// ANTWORTEN HOLEN
  // SQL-Variable für alle Antworten zu Fragebeitrag
  // (uebergeordnete_id=beitragID) als String zusammenstellen
	$sql = "SELECT * FROM beitraege WHERE uebergeordnete_id=$beitragID;";
  // SQL-Variable an Datenbank schicken und Ergebnist in Variable $antwortenResultat speichern
	$antwortenResultat = $db->query($sql);
  // alle Datensätze aus $resultat
  // in ein assoziatives Array umwandeln und in $antwortenArray speichern
	$antwortenArray = $antwortenResultat->fetchAll();


  // leeres Array erstellen und in Variable $frageMitAntworten speichern
  $frageMitAntworten = array();
  // $frageArray als erstes Element in $frageMitAntworten-Array
  // mit dem Bezeichner ['frage'] speichern
  $frageMitAntworten['frage'] = $frageArray;
  // $antwortenArray als zweites Element in $frageMitAntworten-Array
  // mit dem Bezeichner ['antworten'] speichern
  $frageMitAntworten['antworten'] = $antwortenArray;


  // Inhalt des Arrays $frageMitAntworten als JSON ausgeben
  echo json_encode($frageMitAntworten);

// Wenn im $_POST-Array derBezeichner 'beitragID' NICHT vorhanden ist ...
}else{
  // false ausgeben
  echo false;
}
?>
