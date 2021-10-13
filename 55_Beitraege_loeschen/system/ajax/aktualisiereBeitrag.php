<?php
// data.php laden (für DB-Verbindung)
require_once('../data.php');

if(isset($_POST['beitragID'])){
  $beitragID = $_POST['beitragID'];
  if(isset($_POST['titel'])){
    $titel = $_POST['titel'];
  }
  if(isset($_POST['inhalt'])){
    $inhalt = $_POST['inhalt'];
  }

  $db = dbVerbindungErzeugen(); // in data.php
	$sql = "UPDATE beitraege SET titel=?, inhalt=? WHERE id=?;";
	$stmt = $db->prepare($sql);
	$resultat = $stmt->execute(array($titel, $inhalt, $beitragID));

  echo $resultat;

}else{
  echo false;
}
?>
