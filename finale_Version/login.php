<?php
// ------------------- CONTROLLER -------------------
session_start(); // Start einer neuen, oder Weiterführung einer bestehenden Session
require_once('system/data.php');

// Wir prüfen, ob es eine Session-Variable $_SESSION['userid'] gibt.
if(isset($_SESSION['userid'])) {
  // Falls es eine solche Variable gibt, zerstören wir sie...
  unset($_SESSION['userid']);
  // ... und beenden gleich darauf die Session.
  // Ergebnis: Der User ist ausgeloggt.
  session_destroy();
}

$logged_in = false;
$log_in_out_text = "Anmelden";

if(isset($_POST['loginSender'])){
  $loginSchalter = true;
  $msg = "";

  if(!empty($_POST['email'])){
    $email = $_POST['email'];
  }else{
    $msg .= "Bitte gib deine E-Mailadresse  ein.<br>";
    $loginSchalter = false;
  }

  if(!empty($_POST['passwort'])){
    $passwort = $_POST['passwort'];
  }else{
    $msg .= "Bitte gib dein Passwort ein.<br>";
    $loginSchalter = false;
  }

  if($loginSchalter){
    $abfrageErgebnis = login($email , $passwort);   // Siehe system/data.php

    if($abfrageErgebnis){
      $user = $abfrageErgebnis;
      $_SESSION['userid'] = $user['id'];

      header('Location: index.php');
      exit;

    }else{
      $msg = "Die Benutzerdaten sind nicht in unserer Datenbank vorhanden.";
    }
  }
}
// ---------------------- VIEW ----------------------
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>MMP-Forum - Login</title>
  <link rel="stylesheet" href="css/style.css" >
</head>
<body>
  <!-- Inhalt mit Navigation -->
  <div class="container">
    <nav>
      <a href="index.php" class="menueButton" id="homeLink">Home</a>
      <a href="register.php" class="menueButton" id="registrierenLink">Registrieren</a>
    </nav>

    <div>
      <h1 id="ueberschrift">Anmelden</h1>
      <p>Melde dich an, wenn du deine Beiträge bearbeiten und löschen möchtest.</p>
    </div>

    <section class="content">

      <form action="<?php echo $_SERVER['PHP_SELF'] ?>" method="post">
        <div>
          <label>E-Mail:
            <input type="email" name="email" id="id_email">
          </label>
        </div>
        <div>
          <label> Passwort:
            <input type="password" name="passwort">
          </label>
        </div>
        <button type="submit" name="loginSender" value="einloggen">Anmelden</button>
      </form>



    </section>
  </div>
</body>
</html>
