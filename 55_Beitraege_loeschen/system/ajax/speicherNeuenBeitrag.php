<?php
// data.php laden (für DB-Verbindung)
require_once('../data.php');

if(isset($_POST['titel'])){
  $titel = $_POST['titel'];
}
if(isset($_POST['inhalt'])){
  $inhalt = $_POST['inhalt'];
}
if(isset($_POST['userId'])){
  $userId = $_POST['userId'];
}
if(isset($_POST['uebergeordneteId'])){
  $uebergeordneteId = $_POST['uebergeordneteId'];
}

$db = dbVerbindungErzeugen(); // in data.php

$sql = "INSERT INTO beitraege (titel, inhalt, uebergeordnete_id, autor_id) VALUES (?,?,?,?);";
$stmt = $db->prepare($sql);
$stmt->execute(array($titel, $inhalt, $uebergeordneteId, $userId));

echo $db->lastInsertId();
?>
