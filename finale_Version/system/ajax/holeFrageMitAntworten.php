<?php
// data.php laden (für DB-Verbindung)
require_once('../data.php');

if(isset($_GET['beitragID'])){
  $beitragID = $_GET['beitragID'];

  $db = dbVerbindungErzeugen(); // in data.php

// FRAGE HOLEN
	$sql = "SELECT * FROM beitraege WHERE id=$beitragID;";
	$frageResultat = $db->query($sql);
	$frageArray = $frageResultat->fetch();

// ANTWORTEN HOLEN
	$sql = "SELECT * FROM beitraege WHERE uebergeordnete_id=$beitragID;";
	$antwortenResultat = $db->query($sql);
	$antwortenArray = $antwortenResultat->fetchAll();

// ARRAY FÜR JSON ZUSAMMENSTELLEN
  $frageMitAntworten = array();
  $frageMitAntworten['frage'] = $frageArray;
  $frageMitAntworten['antworten'] = $antwortenArray;

  echo json_encode($frageMitAntworten);
}else{
  echo false;
}
?>
