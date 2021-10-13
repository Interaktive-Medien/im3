<?php


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
            <input type="email" name="email" value="<?php if(isset($email)) echo $email ?>">
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
            <input type="text" name="vorname" value="<?php if(isset($vorname)) echo $vorname ?>">
          </label>
        </div>
        <div>
          <label>Nachname:
            <input type="text" name="nachname" value="<?php if(isset($nachname)) echo $nachname ?>">
          </label>
        </div>
        <button type="submit" name="registrierSender" value="einloggen">Registrieren</button>
      </form>


    </section>
  </div>
</body>
</html>
