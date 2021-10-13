<?php
  // Start einer neuen, oder Weiterführung einer bestehenden Session
  session_start();
  // data.php laden (für DB-Verbindung)
  require_once('../data.php');

  if(isset($_SESSION['userid'])){
    $userID = ($_SESSION['userid']);

    $db = dbVerbindungErzeugen(); // in data.php
    $sql = "SELECT * FROM user WHERE id = $userID;";
  	$resultat = $db->query($sql);
    $user =  $resultat->fetch();
  }else{
    $user = array();
    $user['id'] = 0;
  }
  echo json_encode($user);
?>
