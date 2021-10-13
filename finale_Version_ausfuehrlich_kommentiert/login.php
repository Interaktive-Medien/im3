<?php
// ------------------- CONTROLLER -------------------
session_start(); // Start einer neuen, oder Weiterführung einer bestehenden Session
// Alle DB-Abfragen sind in data.php zusammengefasst.
require_once('system/data.php');
// Die Verwaltung der Session erledigen wir hier nicht über eine externe Datei, sondern direkt im Controller

// Wir prüfen, ob es eine Session-Variable $_SESSION['userid'] gibt.
if(isset($_SESSION['userid'])) {
  // Falls es eine solche Variable gibt, zerstören wir sie...
  unset($_SESSION['userid']);
  // ... und beenden gleich darauf die Session.
  // Ergebnis: Der User ist ausgeloggt.
  session_destroy();
}
// Die in templates/menu.php benötigten Variablen müssen wir im Controller setzen.
// (Diese Variablen werden sonst in templates/session_handler.php vergeben.)
$logged_in = false;
$log_in_out_text = "Anmelden";

// Wir prüfen, ob der User das Login-Formular abgeschickt hat.
// Nur dann versuchen wir den User mit den eingegebenen Daten einzuloggen.
// Ansonsten wird lediglich das leere Formular angezeigt.
//
// Im Array $_POST werden alle Daten übertragen, die von einem Formular mit der Methode POST übermittelt wurden.
// Der Bezeichner (hier: 'loginSender') entspricht dabei dem name-Attribut des jeweiligen Formularelements.
// In unserem Beispiel prüfen wir, ob es in dem abgeschickten Formular ein Element mit dem
//   name-Attribut 'loginSender' gibt.
//   <input ... name="loginSender" ...>
// Welchen Wert das <input>-Element hat, prüfen wir nicht.
// In unserem Beispiel handelt es sich um Anmelden-Schaltfläche.
if(isset($_POST['loginSender'])){

  // Wir führen eine ganz einfache Überpüfung der eingegebenen Daten durch.
  // Dabei prüfen wir nur, OB etwas eingegeben wurde
  // Zuerst setzen wir aber eine sog. Schalter-Variable ($loginSchalter) auf den Wert true.
  // Dabei gehen wir erstmal davon aus, dass der User alles richtig eingibt.
  // Erst wenn er einen Fehler macht, also einen Wert nicht eingibt,
  //   setzen wir die Schaltervariable auf false.
  // Der eigentliche Login-Vorgang wird nur durchgeführt, wenn $loginSchalter true ist.
  $loginSchalter = true;

  // Sollte der User einen Fehler machen, sollten wir ihm auch mitteilen, was er falsch gemacht hat.
  // Dazu erzeugen wir zuerst die Variable $msg mit einer leeren Zeichenkette als Inhalt.
  // Sollte der User einen Fehler machen, hängen wir die entsprechende Fehlermeldung
  //   an die bestehende (jetzt noch leere) Zeichenkette an.
  // Wenn $msg nicht leer ist, geben wir den Inhalt im View aus.
  $msg = "";

  // Jetzt prüfen wir, ob der User einen Wert in
  //   <input ... name="email" ...> eingegeben hat.
  if(!empty($_POST['email'])){
    // Wenn das der Fall ist, speichern wir den Inhalt in der Variablen $email.
    $email = $_POST['email'];
  }else{
    // Andernfalls hängen wir eine Fehlermeldung an die Variable $msg an.
    // Das Anhängen erfolgt durch den Punkt (.) vor dem Gleichheitszeichen (=).
    // Der Punkt ist der sog. Verkettungsopperator.
    $msg .= "Bitte gib deine E-Mailadresse  ein.<br>";
    // Ohne $email kann der User nicht eingeloggt werden. Daher setzen wir die
    //    Schalter-Variable ($loginSchalter) auf den Wert false.
    $loginSchalter = false;
  }

  // Für <input ... name="passwort" ...> gehen wir analog der email-Eingabe vor.
  if(!empty($_POST['passwort'])){
    $passwort = $_POST['passwort'];
  }else{
    $msg .= "Bitte gib dein Passwort ein.<br>";
    $loginSchalter = false;
  }

  // Wenn $loginSchalter noch immer true ist, können wir versuchen den User einzuloggen.
  if($loginSchalter){

    // Die eingegebenen Daten des Users werden durch unsere login()-Funktion
    //   aus system/data.php mit der Datenbank abgeglichen.
    // Die Funktion liefert entweder die vollständigen Userdaten als assoziatives Array,
    //   oder den Wert false zurück.
    // Die Bezeichner des Assoziativen Arrays sind die Namen der Datenbankspalten der Tabelle user.
    // Wir speichern das Ergebnis in $abfrageErgebnis.
    $abfrageErgebnis = login($email , $passwort);   // Siehe system/data.php

    // Eine if()-Bedingung prüft nur, ob Bdingung in den Klammern false, bzw. 0 ist.
    // Alle anderen Werte werden als true angesehen.
    // Wenn also Userdaten in $abfrageErgebnis gespeichert sind, ist die Bedingung erfüllt.
    if($abfrageErgebnis){
      // Wir speichern den Inhalt von $abfrageErgebnis in der Variablen $user.
      // Dieser Schritt ist technisch überflüssig. Er dient lediglich dem
      //   besseren Verständnis und der besseren Lesbarkeit.
      $user = $abfrageErgebnis;

      // In einer Session können Daten kurzzeitig gespeichert werden, um sie bei
      //   nachfolgenden Seitenaufrufen wieder abzurufen.
      // $_SESSION ist dabei ein assoziatives Array, deren Bezeichner wir selbst vergeben können.
      // Wir speichern die $user['id'] aus der DB ni der Session unter dem Bezeichner 'userid'.
      // Auf nachfolgenden Seiten können wir diesen Wert mit $_SESSION['userid'] wieder abrufen.
      // Ist dieser Wert vorhanden, ist der User eingeloggt, anderenfalls wird er als
      //   anonymer User behandelt und kann keine Inserate aufgeben, bearbeiten oder löschen.
      //
      // Siehe: https://www.php-einfach.de/php-tutorial/php-sessions/
      $_SESSION['userid'] = $user['id'];

      // Hiermit leiten wir den User auf index.php weiter.
      header('Location: index.php');
      // Danach quittieren wir die weitere Abarbeitung des PHP Programmes mit exit;,
      //   weil sonst noch weitere Programmteile abgearbeitet werden würden.
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

      <!-- FORM
        Das <form>-Element umschliesst alle Formularfelder, deren Wert zum auswwrtenden Skript geschickt werden sollen.
        Im action-Attribut des <form>-Elements steht die Adresse Skripts, das den Formularinhalt auswertet,
          in unserem Fall ist das login.php, also eben diese Seite, in dem sich auch das Formular befindet.
        Das method-Attribut enthät die Methode, mit der der Inhalt der Formularfelder verschickt wird.
          POST: Werte werden unsichtbar, !!!!! ABER NICHT VERSCHLÜSSELT !!!!! verschickt.
          GET:  Wetre werden an die URL angehängt.

        Siehe: https://wiki.selfhtml.org/wiki/HTML/Formulare/form
        Siehe: https://www.w3schools.com/html/html_forms.asp
      -->
      <form action="<?php echo $_SERVER['PHP_SELF']; // $_SERVER['PHP_SELF'] gibt die Adresse der aktuellen Datei aus ?>" method="post">
        <div>
          <!-- LABEL
            Siehe: https://wiki.selfhtml.org/wiki/HTML/Formulare/label
            Siehe: https://www.w3schools.com/tags/tag_label.asp
          -->
          <label>E-Mail:
            <!-- INPUT
              Siehe: https://wiki.selfhtml.org/wiki/HTML/Formulare/input
              Siehe: https://www.w3schools.com/tags/tag_input.asp
              type-Attribut
              Siehe: https://www.w3schools.com/tags/att_input_type.asp
              Siehe: https://www.w3schools.com/html/html_form_input_types.asp
            -->
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
