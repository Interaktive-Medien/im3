<?php
  // Start einer neuen, oder Weiterführung einer bestehenden Session
  session_start();
  // data.php laden (für DB-Verbindung)
  require_once('../data.php');

  // Wenn die Session-Variable 'userid' vorhanden ist ...
  if(isset($_SESSION['userid'])){
    // ... Wert aus $_SESSION['userid'] in Variable $userID speichern
    $userID = ($_SESSION['userid']);

    $db = dbVerbindungErzeugen(); // in data.php
    // SQL-Variable für einzelnen User
    // (id = $userID) als String zusammenstellen
    $sql = "SELECT * FROM user WHERE id = $userID;";
    // SQL-Variable an Datenbank schicken und Ergebnis in Variable $resultat speichern
  	$resultat = $db->query($sql);
    // den ersten (und einzigen) Datensatz aus $resultat
    // in ein assoziatives Array umwandeln und in $user speichern
    $user =  $resultat->fetch();
  }else{ // ... wenn es $_SESSION['userid'] NICHT gibt
    // leeres Array $user erzeugen
    $user = array();
    // Den Wert 0 als erstes (und einziges) Element in $user-Array
    // mit dem Bezeichner ['id'] speichern
    $user['id'] = 0;
  }
  // Inhalt des Arrays $user als JSON ausgeben
  echo json_encode($user);
?>
