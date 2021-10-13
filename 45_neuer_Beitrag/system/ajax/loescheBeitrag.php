<?php
// data.php laden (für DB-Verbindung)
require_once('../data.php');

if(isset($_POST['beitragID'])){
  $beitragID = $_POST['beitragID'];

  $db = dbVerbindungErzeugen(); // in data.php

  // Antwort-Datensätze zu Frage löschen (bei Frage wird kein Datensatz gelöscht)


  // Frage-Datensatz löschen


  // Ergebnis ausgeben

}else{
  echo false;
}
?>
