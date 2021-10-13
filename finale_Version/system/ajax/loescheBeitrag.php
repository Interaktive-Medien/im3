<?php
// data.php laden (für DB-Verbindung)
require_once('../data.php');

if(isset($_POST['beitragID'])){
  $beitragID = $_POST['beitragID'];

  $db = dbVerbindungErzeugen(); // in data.php

  // Antwort-Datensätze zu Frage löschen (bei Frage wird kein Datensatz gelöscht)
  $antwortenLoeschenSql = "DELETE FROM beitraege WHERE uebergeordnete_id = ?;";
  $antwortenLoeschenStmt = $db->prepare($antwortenLoeschenSql);
  $antwortenLoeschenStmt->execute(array($beitragID));


  // Frage-Datensatz löschen
  $frageLoeschenSql = "DELETE FROM beitraege WHERE id = ?;";
  $frageLoeschenStmt = $db->prepare($frageLoeschenSql);
	$resultat = $frageLoeschenStmt->execute(array($beitragID));

  echo $resultat;
}else{
  echo false;
}
?>
