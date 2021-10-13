<?php
// data.php laden (für DB-Verbindung)
require_once('../data.php');

$db = dbVerbindungErzeugen(); // in data.php
$sql = "SELECT * FROM beitraege WHERE uebergeordnete_id = 0;";
$resultat = $db->query($sql);
$resultatArray = $resultat->fetchAll();

echo json_encode($resultatArray);
?>
