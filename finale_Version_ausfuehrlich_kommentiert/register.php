<?php
// ------------------- CONTROLLER -------------------
// Die Initialisierung der Session und das Laden der benötigten Dateien läuft
//   analog zu login.php ab.
session_start();
require_once('system/data.php');

if(isset($_SESSION['userid'])) {
  unset($_SESSION['userid']);
  session_destroy();
}

// Die Prüfun, ob die Seite direkt, oder durch Klick auf die Registrieren-Schaltfläche
//   geladen wurde, läuft analog zu login.php ab.
// Die Validierung der einzelnen Eingaben läuft mit einer Ausnahme analog zu login.php ab.
if(isset($_POST['registrierSender'])){

  $msg = "";
  $registrierSchalter = true;

  if(!empty($_POST['email'])){
    $email = $_POST['email'];
  }else{
    $msg .= "Bitte gib deine E-Mailadresse  ein.<br>";
    $registrierSchalter = false;
  }

  if(!empty($_POST['passwort'])){
    $passwort = $_POST['passwort'];
  }else{
    $msg .= "Bitte gib dein Passwort ein.<br>";
    $registrierSchalter = false;
  }

  // Wir überpüfen, ob der User etwas in
  //   <input ... name="passwortBestaetigung" ...>
  //   eingegeben hat und ob dieser Wert mit $passwort übereinstimmt.
  if(empty($_POST['passwortBestaetigung']) || $passwort != $_POST['passwortBestaetigung']){
    $msg .= "Passwort und Passwortbestätigung stimmen nicht überein.<br>";
    $registrierSchalter = false;
  }

  if(!empty($_POST['vorname'])){
    $vorname = $_POST['vorname'];
  }else{
    $msg .= "Bitte gib deinen Vornamen ein.<br>";
    $registrierSchalter = false;
  }

  if(!empty($_POST['nachname'])){
    $nachname = $_POST['nachname'];
  }else{
    $msg .= "Bitte gib deinen Nachnamen ein.<br>";
    $registrierSchalter = false;
  }
  // Daten in die Datenbank schreiben ******************************************************

  if($registrierSchalter){
    // Zuerst müssen wir überprüfen, od der User schon existiert.
    // Indiz dafür ist die E-Mail-Adresse.
    // Jede E-Mail-Adresse darf in der DB nur einmal vorkommen.
    // Die Funktion existiertEmail() steht in system/data.php.
    // Wir erwarten als Ergebnis den Wert 0, also keine Einträge.
    if(existiertEmail($email)){
      // Wenn existiertEmail() etwas anderes als 0 zurückgibt, existiert die E-mail-Adresse berits.
      // Der User kann sich nicht erneut registrieren.
      // Wir erweitern $msg um die entsprechende Fehlermeldung.
      $msg = "Diese E-Mail-Adresse ist bereits vergeben.</br>";
    }else{
      // Wenn existiertEmail() den Wert 0 zurückgibt, schreiben wir einen neuen User in die DB.
      // Die userSpeichern()-Funktion befindet sich ebenfalls in system/data.php.
      // Wenn der User erfolgreich gespeichert wurde gibt sie true zurück, anderenfalls false.
      $abfrageErgebnis = userSpeichern($email, $passwort, $vorname, $nachname);

      // Meldung für den User zusammenstellen
      if($abfrageErgebnis){  // Wenn der User erfolgreich gespeichert wurde ...
        unset($_POST);  // Daten aus der $_POST-Variablen löschen, damit sie nicht wersehentlich nochmal geladen werden.
        $msg = "Du hast dich erfolgreich registriert.</br>"; // Nachricht schreiben
      }else{       // andernfalls ...
        $msg .= "Es gibt ein Problem mit der Datenbankverbindung.</br>"; // Nachricht schreiben
      }
    }
  }

}

// ---------------------- VIEW ----------------------
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>MMP-Forum - Registrierung</title>
  <link rel="stylesheet" href="css/style.css" >
</head>
<body>

  <div class="container">
    <nav>
      <a href="index.php" class="menueButton" id="homeLink">Home</a>
      <a href="login.php" class="menueButton" id="loginLink">Anmelden</a>
    </nav>


    <section class="content">
      <h1>Registrieren</h1>
      <p>Bitte registriere dich, um neue Inserate zu erstellen oder deine bestehenden Inserate zu löschen.</p>

      <form action="<?php echo $_SERVER['PHP_SELF']?>" method="post">
        <div>
          <label >Email:
            <input type="email" name="email" value="<?php if(isset($email)) echo $email; // Wenn es einen $email-Wert gibt, wird er angezeigt ?>">
          </label>
        </div>
        <!-- Passwort und Passwortbestätigung müssen jedesmal neu eingegeben werden -->
        <div>
          <label>Passwort:
            <input type="password" name="passwort">
          </label>
        </div>
        <div>
          <label>Passwortbestätigung:
            <input type="password" name="passwortBestaetigung">
          </label>
        </div>
        <div>
          <label>Vorname:
            <input type="text" name="vorname" value="<?php if(isset($vorname)) echo $vorname; // Wenn es einen $vorname-Wert gibt, wird er angezeigt ?>">
          </label>
        </div>
        <div>
          <label>Nachname:
            <input type="text" name="nachname" value="<?php if(isset($nachname)) echo $nachname; // Wenn es einen $nachname-Wert gibt, wird er angezeigt ?>">
          </label>
        </div>
        <button type="submit" name="registrierSender" value="einloggen">Registrieren</button>
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
