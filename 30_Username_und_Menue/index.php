<?php
// ------------------- CONTROLLER -------------------
session_start(); // Start einer neuen, oder Weiterführung einer bestehenden Session
require_once('system/data.php');
if(isset($_SESSION['userid'])){
  $userID = $_SESSION['userid'];
  echo "Du bist mit der id $userID eingeloggt.";

}else{
  echo "du bist nicht eingeloggt.";
}
?>
<!DOCTYPE html>
<html>
<head>

  <meta charset="utf-8">
  <title>MMP-Forum</title>
  <link rel="stylesheet" href="css/style.css" >
</head>
<body>
  <div class="container">
    <nav>
      <a href="index.php" class="menueButton" id="homeLink">Home</a>
      <a href="login.php" class="menueButton" id="loginLink">Anmelden</a>
      <a href="register.php" class="menueButton" id="registrierenLink">Registrieren</a>
      <span class="user"  id="userStatus">anonymer User</span>
    </nav>
    <div>
      <h1 id="ueberschrift">Fragenübersicht</h1>
    </div>
    <div id="forum_inhalt">



    </div>
  </div>

</body>
</html>
