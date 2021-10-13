<?php
// ------------------- CONTROLLER -------------------
require_once('system/data.php');


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

      <form action="login.php" method="post">
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

<?php if(!empty($msg)){ ?>
      <div>
        <p><?php echo $msg; // $msg (Nachricht) ausgeben ?></p>
      </div>
<?php  }?>

    </section>
  </div>
</body>
</html>
