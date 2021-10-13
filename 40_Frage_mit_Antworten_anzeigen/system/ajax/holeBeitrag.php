<?php
// data.php laden (für DB-Verbindung)
require_once('../data.php');

if(isset($_GET['beitragID'])){
  $beitragID = $_GET['beitragID'];

  $db = dbVerbindungErzeugen(); // in data.php
	$sql = "SELECT * FROM beitraege WHERE id = $beitragID;";
	$resultat = $db->query($sql);
	$resultatArray = $resultat->fetch();

  echo json_encode($resultatArray);
}else{
  echo false;
}
?>
