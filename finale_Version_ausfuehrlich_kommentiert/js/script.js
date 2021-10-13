// !!!!!!!!!! Wird beim laden der Seite ausgeführt !!!!!!!!!!

// HTML-Elemente in JS-Variablen speichern
let inhalt = document.querySelector('#forum_inhalt');
let ueberschrift = document.querySelector('#ueberschrift');


// im gesamten Script zugängliche Hauptvariablen

// Standardwert für user ({} = leeres JS-Objekt = User nicht eingeloggt)
// wird mit Funktion userIdentifizieren() auf den den neusten Stand gebracht
// wichtig für die Anzeige und bei der Speicherung neuer Beiträge
// nur eingeloggte User dürfen EIGENE Beiträge bearbeiten und löschen
let user = {};

// Standardwert für uebergeordneteId (0 = kein übergeordneter Beitrag = Frage)
// wichtig bei der Speicherung neuer Beiträge
let uebergeordneteId = 0;

// Inhalt der Seiten-Überschrift
// je nach Rubrik verhalten sich Fuktionen unterschiedlich
let rubrik = ""



// Aufruf der Funktion start()
start();

/* ** Funktion: rubrikAendern(...) **
* Beschreibung
*   speichert Parameter in Variable rubrik
*   ändert Inhalt von ueberschrift in Variablenwert
* Parameter
*   rubrikName: Name der neuen Rubrik
*               Standardwert: "alle Fragen"
*/
function rubrikAendern(rubrikName = "alle Fragen"){
  rubrik = rubrikName;
  ueberschrift.textContent = rubrik;
}


/* ** Funktion: start() **
* Beschreibung
*   Holt mit fetch() aus "system/ajax/holeUserId.php"
*   einen Integer-Wert.
*   id = 0:  User nicht eingeloggt (anonym)
*   id != 0: User ist eingeloggt, id des Users
* Wert in JS-Objekt user (Hauptvariable) speichern
*
* dann aufruf der nächsten Funktion
*/
function start(){
  let  url = "system/ajax/holeUser.php";
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((userData) => {
      // console.log(userData);
      // userData.id = 0:  User nicht eingeloggt
      // userData.id != 0: User eingeloggd, ist id des Users
      user = userData;

      // HTML-Elemente in JS-Variablen speichern
      let userStatus = document.querySelector('#userStatus');
      let loginLink = document.querySelector('#loginLink');
      let registrierenLink = document.querySelector('#registrierenLink');
      // Wenn User nicht eingeloggt ist (user.id == 0) ...
      if(user.id == 0){
        // Textinhalt von userStatus ändern
        userStatus.textContent = "anonymer User";
        // Textinhalt von userStatus loginLink
        loginLink.textContent = "Anmelden";
      } else { // ... sonst (user ist eingeloggt)...
        // Textinhalt von userStatus in Inhalte der Werte 'vorname' und 'nachname'
        // des JS-Objekts 'user' ändern
        userStatus.textContent = user.vorname + " " + user.nachname;
        // Textinhalt von loginLink ändern
        loginLink.textContent = "Logout";
        // Link zum Registrieren entfernen (sinnlos für eingeloggte User)
        registrierenLink.remove();
      }
      // Aufruf der Funktion alleFragenHolen()
      alleFragenHolen();
    })
    .catch(function(error) {
      console.log('Error: ' + error.message);
    });
}


// =============================================================================================
// !!!!!!!!!! Ansichten (verwenden und benötigen Bausteine) !!!!!!!!!!

// -----------------------------------------------------------------------------
// ::: Ansicht A: Überblick

/* ** Funktion: alleFragenHolen() **
* Beschreibung
*   Holt mit fetch() aus "system/ajax/holeAlleFragen.php"
*   alle Frage-Beiträge als JSON aus der Datenbank.
*   (s. holeAlleFragen.php)
* Die erhaltenen Daten werden an die Funktion
*    alleFragenAnzeigen(...) zur Darstellung weitergegeben.
*/
function alleFragenHolen(){
  let  url = "system/ajax/holeAlleFragen.php";
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((alleFragen) => {
      //console.log(alleFragen)
      alleFragenAnzeigen(alleFragen)
    })
    .catch(function(error) {
      console.log('Error: ' + error.message);
    });
}

/* ** Funktion: alleFragenAnzeigen(...) **
* Beschreibung
*     Organisiert die Anzeige aller Fragen auf einer Seite
* Parameter
*   alleFragenObj: JS-Objekt mit allen Fragen
* Ruft zuerst für jede Frage Baustein 1 auf um Beitrag (Frage anzuzeigen).
* Danach Darstellung eines Buttons für neuen Beitrag (Frage).
*/
function alleFragenAnzeigen(alleFragenObj){
  // Seite leeren
  inhalt.innerHTML = "";
  // Rubrik ändern
  rubrikAendern("alle Fragen");
  // uebergeordneteId auf 0 -> wichtig für Erstellung eines neuen Beitrags (Frage)
  uebergeordneteId = 0;

  // Fragen anzeigen
  // alleFragenObj in Schleife durchlaufen
  // bei jedem Schleifendurchlauf gibt es ein Schleifen-Objekt, in dem
  // alle Inhalte eines Beitrags (Frage) enthalten sind.
  // Bezeichner in Schleifen-Objekt -> Spaltenname der DB
  for(let i = 0; i < alleFragenObj.length; i++){
    // neues div-Element "frageDiv" für Beitrag (Frage)
    let frageDiv = document.createElement('div');
    // class-Attribut für frageDiv
    frageDiv.setAttribute("class", "frage");
    // Aufruf der Funktion zur Darstellung eines Beitrags
    // Parameter
    //   frageDiv: Element, in welchem der Beitrag (Frage) angezeigt werden soll
    //   alleFragenObj[i]: aktuelles Schleifen-Objekt [i] mit Inhalten
    beitragAnzeigen(frageDiv, alleFragenObj[i]);
    // frageDiv an Seite anhängen (wird jetzt auf Seite angezeigt)
    inhalt.appendChild(frageDiv);
  }

  // Button für neue Frage
  // neues button-Element
  let frageNeuBtn = document.createElement('button');
  // Beschriftung des frageNeuBtn
  frageNeuBtn.textContent = "neue Frage";
  // bei Event "click" auf frageNeuBtn ...
  frageNeuBtn.addEventListener("click", function(){
    // neues div-Element für neue Frage
    let neuFrageDiv = document.createElement('div');
    // class-Attribut für neuFrageDiv
    neuFrageDiv.setAttribute("class", "frage");
    // setzt neues neuFrageDiv vor das Element, welchens den Click ausgelöst hat (this)
    // in diesem Fall ist "this" das frageNeuBtn
    // .before() ersetzt hier appendChild()
    this.before(neuFrageDiv);
    // Aufruf der Funktion zur Erstellung (oder Bearbeitung) eines Beitrags
    // Parameter
    //   neuFrageDiv: div-Element, in welchem der Beitrag (Antwort) erstellt soll (wo)
    beitragErstellenOderBearbeiten(neuFrageDiv);
  })
  // frageNeuBtn an Seite anhängen (wird jetzt auf Seite angezeigt)
  inhalt.appendChild(frageNeuBtn);
}
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// ::: Ansicht B: Detail
// ... Alle eine Frage mit allen Antworten holen und anzeigen

/* ** Funktion: frageMitAntwortenHolen(...) **
* Beschreibung
*   Holt mit fetch() aus "system/ajax/holeFrageMitAntworten.php"
*   eine Frage mit allen Antworten als JSON aus der Datenbank.
*   (s. holeFrageMitAntworten.php)
* Parameter
*   id: id des gesuchten Beitrags
* Die erhaltenen Daten werden an die Funktion
*    frageMitAntwortenAnzeigen(...) zur Darstellung weitergegeben.
*/
function frageMitAntwortenHolen(id){
  // Erstellung der Variablen url
  // An die eigentliche Adresse wird
  //   "...?beitragID=" + id
  //   angehängt.
  //   ?          : Verbindung zwischen URL und zu übergebenden Variablen
  //   beitragID  : Variablen-Name
  //   =          : Zuweisungsoperator
  //   "          : Ende der festen URL-Zeichenkette
  //   +          : String-Verbindungsoperator in JavaScript
  //   id         : JS-Variable mit id des gesuchten Beitrags
  // So übertragene Werte können per GET in PHP empfangen werden.
  // !!!!! ACHTUNG: NIEMALS sensible Daten mit GET übertragen! !!!!!!
  let  url = "system/ajax/holeFrageMitAntworten.php?beitragID=" + id;
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((frageMitAntworten) => {
      console.log(frageMitAntworten);
      frageMitAntwortenAnzeigen(frageMitAntworten)
    })
    .catch(function(error) {
      console.log('Error: ' + error.message);
    });
}

/* ** Funktion: frageMitAntwortenAnzeigen(...) **
* Beschreibung
*     Organisiert die Anzeige einer Frage mit allen zugehörigen Antworten auf einer Seite
* Parameter
*   frageUndAntwortenObj: JS-Objekt mit einer Frage und allen zugehörigen Antworten
* Ruft zuerst für jede Frage Baustein 1 auf um Beitrag (Frage anzuzeigen).
* Danach Darstellung eines Buttons für neuen Beitrag (Frage).
*/
function frageMitAntwortenAnzeigen(frageUndAntwortenObj){
  // Objekt frageUndAntwortenObj besteht aus zwei Unterobjekten
  //  frage: Beitrags-Objekt mit allen DB-Inhalten zum Frage-Beitrag
  //  antworten: alle Beitrags-Objekte jeweils mit allen DB-Inhalten zum entsprechenden Antwort-Beitrag

  // Seite leeren
  inhalt.innerHTML = "";
  // Rubrik ändern
  rubrikAendern(rubrikName = "eine Frage mit Antworten")

  // Frage Unterobjekt in JS-Variable frage speichern
  let frage = frageUndAntwortenObj.frage;
  // uebergeordneteId = id der Frage -> wichtig für Erstellung eines neuen Beitrags (Antwort)
  uebergeordneteId = frage.id;

  // .................................................................................
  // neues div-Element für Frage mit Antworten (dient der Optik und besseren Übersicht)
  let frageUndAntwortenDiv = document.createElement('div');
  // class-Attribut für neues Element
  frageUndAntwortenDiv.setAttribute("class", "frage");
  // neues div-Element an Seite anhängen (wird jetzt auf Seite angezeigt)
  inhalt.appendChild(frageUndAntwortenDiv);

  // neues div-Element für Frage
  let frageDiv = document.createElement('div');
  // Aufruf der Funktion zur Darstellung eines Beitrags
  // Parameter
  //   frageDiv: Element, in welchem der Beitrag (Frage) angezeigt werden soll
  //   frage: Beitrags-Objekt mit Inhalten
  beitragAnzeigen(frageDiv, frage);
  // neues div-Element an frageUndAntwortenDiv anhängen (wird jetzt auf Seite angezeigt)
  frageUndAntwortenDiv.appendChild(frageDiv);

  // .................................................................................
  // Antworten Unterobjekt in JS-Variable antworten speichern
  // antworten in Schleife durchlaufen
  // bei jedem Schleifendurchlauf gibt es ein Schleifen-Objekt, in dem
  // alle Inhalte eines Beitrags (Antwort) enthalten sind.
  // Bezeichner in Schleifen-Objekt -> Spaltenname der DB
  let antworten = frageUndAntwortenObj.antworten;
  for(let i = 0; i < antworten.length; i++){
    // neues div-Element "antwortDiv" für Beitrag (Antwort)
    let antwortDiv = document.createElement('div');
    // class-Attribut für antwortDiv
    antwortDiv.setAttribute("class", "antwort");
    // Aufruf der Funktion zur Darstellung eines Beitrags
    // Parameter
    //   antwortDiv: Element, in welchem der Beitrag (Antwort) angezeigt werden soll
    //   antworten[i]: aktuelles Schleifen-(Beitrags)-Objekt [i] mit Inhalten
    beitragAnzeigen(antwortDiv, antworten[i]);
    // antwortDiv an frageUndAntwortenDiv anhängen (wird jetzt auf Seite angezeigt)
    frageUndAntwortenDiv.appendChild(antwortDiv);
  }

  // .................................................................................
  // Button für neue Antwort
  // neues button-Element
  let antwortNeuBtn = document.createElement('button');
  // Beschriftung des antwortNeuBtn
  antwortNeuBtn.textContent = "neue Antwort";
  // bei Event "click" auf antwortNeuBtn ...
  antwortNeuBtn.addEventListener("click", function(){
    // neues div-Element für neue Antwort
    let neuAntwortDiv = document.createElement('div');
    // class-Attribut für neuAntwortDiv
    neuAntwortDiv.setAttribute("class", "antwort");
    // setzt neues neuAntwortDiv vor das Element, welchens den Click ausgelöst hat (this)
    // in diesem Fall ist "this" das antwortNeuBtn
    // .before() ersetzt hier appendChild()
    this.before(neuAntwortDiv);
    // Aufruf der Funktion zur Erstellung (oder Bearbeitung) eines Beitrags
    // Parameter
    //   neuAntwortDiv: Element, in welchem der Beitrag (Antwort) angezeigt werden soll
    beitragErstellenOderBearbeiten(neuAntwortDiv);
  })
  // antwortNeuBtn an frageUndAntwortenDiv anhängen (wird jetzt auf Seite angezeigt)
  frageUndAntwortenDiv.appendChild(antwortNeuBtn);
}
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// ::: Ansicht C: einzelner Beitrag
// ... einen Beitrag holen und in einem vorgegebenen div-Element anzeigen

/* ** Funktion: beitragHolenUndAnzeigen(...) **
* Beschreibung
*   Holt mit fetch() aus "system/ajax/holeBeitrag.php?beitragID=" + id;
*   einen Beitrag als JSON aus der Datenbank.
* Parameter
*   id:         id des gesuchten Beitrags
*   beitragDiv: div-Element, in dem der Beitrag angezeigt werden zoll
* Die erhaltenen Daten werden an die Funktion
*    beitragAnzeigen(...) zur Darstellung weitergegeben.
*/
function beitragHolenUndAnzeigen(id, beitragDiv){
  let  url = "system/ajax/holeBeitrag.php?beitragID=" + id;
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((beitrag) => {
      // console.log(beitrag);
      // Aufruf der Funktion zur Darstellung eines Beitrags
      // Parameter
      //   beitragDiv: Element, in welchem der Beitrag angezeigt werden soll
      //   beitrag: Beitrags-Objekt mit Inhalten
      beitragAnzeigen(beitragDiv, beitrag);
    })
    .catch(function(error) {
      console.log('Error: ' + error.message);
    });
}
// -----------------------------------------------------------------------------
// =============================================================================================





// =============================================================================================
// !!!!!!!!!! Datenänderung !!!!!!!!!!
// Funktionen zum Sichern, Ändern und Löschen von Beitrags-Daten aus der Datenbank

// -----------------------------------------------------------------------------
// ::: Datenänderung A: neuen Beitrag in Datenbank schreiben

/* ** Funktion: neuenBeitragSpeichern(...) **
* Beschreibung
*   schickt zu speichernde Daten an speicherNeuenBeitrag.php
* Parameter
*   titel:      titel-Text des neuen Beitrags
*   inhalt:     inhalt-Text des neuen Beitrags
*   beitragDiv: div-Element, in welchem der neue Beitrag erscheinen soll
* Funktion, auf welche die Datenänderung A zugreift
*   beitragHolenUndAnzeigen( ... )  : Ansicht C
* PHP-Datei, auf welche die Datenänderung A zugreift
*   speicherNeuenBeitrag.php
*/
function neuenBeitragSpeichern( titel, inhalt, beitragDiv){
  // formData: Objekt mit Schlüssel/Werte-Paaren zur Übertragung von Daten per POST
  // Der Schlüssel muss NICHT dem Variablenname entsprechen. Es erhöt jedoch die Lesbarkeit
  //  s. https://developer.mozilla.org/de/docs/Web/API/FormData
  let formData = new FormData();
  // Jede Zeile fügt ein Schlüssel/Werte-Paar hinzu.
  // ............('Schlüssel', Wert);
  formData.append('titel', titel);        // Wert aus Fuktionsparameter
  formData.append('inhalt', inhalt);      // Wert aus Fuktionsparameter
  formData.append('userId', user.id);      // Wert aus Hauptvariablen
  formData.append('uebergeordneteId', uebergeordneteId);  // Wert aus Hauptvariablen
  // fetch-Aufruf mit zusätzlichem ...
  fetch("system/ajax/speicherNeuenBeitrag.php",
    // ... Options-Objekt
    {
        body: formData,  // body:   Objekt mit zu übertranden Daten
        method: "post"   // method: Art der Übertragung (get/post)
    })
    .then((response) => {
      return response.text();
    })
    .then((neueId) => {  // erwartet die id des neuen Beitrags
      // console.log(neueId);
      // Aufruf der Funktion zum holen der Beitragsdaten und anschliessenden Anzeige des Beitrags
      // Parameter
      //   neueId: id des anzuzeigenden Beitrags
      //   beitragDiv: div-Element, in dem der Beitrag angezeigt werden soll (aus Funktionsparameter)
      beitragHolenUndAnzeigen(neueId, beitragDiv);
    })
    .catch(function(error) {
      console.log('Error: ' + error.message);
    });
}
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// ::: Datenänderung B: vorhandenen Beitrag in Datenbank aktualisieren

/* ** Funktion: beitragAktualisieren(...) **
* Beschreibung
*   schickt zu aktualisierende Daten an aktualisiereBeitrag.php
* Parameter
*   id:         id des zu aktualisierenden Beitrags
*   titel:      titel-Text des zu aktualisierenden Beitrags
*   inhalt:     inhalt-Text des zu aktualisierenden Beitrags
*   beitragDiv: div-Element, in welchem der neue Beitrag erscheinen soll
* Funktion, auf welche die Datenänderung B zugreift
*   beitragHolenUndAnzeigen( ... )  : Ansicht C
* PHP-Datei, auf welche die Datenänderung B zugreift
*   aktualisiereBeitrag.php
*/
function beitragAktualisieren(id, titel, inhalt, beitragDiv){
  // formData: Objekt mit Schlüssel/Werte-Paaren zur Übertragung von Daten per POST
  let formData = new FormData();
  // Jede Zeile fügt ein Schlüssel/Werte-Paar hinzu.
  // ............('Schlüssel', Wert);
  formData.append('beitragID', id);   // Wert aus Fuktionsparameter
  formData.append('titel', titel,);   // Wert aus Fuktionsparameter
  formData.append('inhalt', inhalt);  // Wert aus Fuktionsparameter
  fetch("system/ajax/aktualisiereBeitrag.php",
    {
        body: formData,  // body:   Objekt mit zu übertranden Daten
        method: "post"   // method: Art der Übertragung (get/post)
    })
    .then((response) => {
      return response.text();
    })
    .then((data) => {// data wird momentan nicht verwendet
      console.log(data);
      // Aufruf der Funktion zum holen der Beitragsdaten und anschliessenden Anzeige des Beitrags
      // Parameter
      //   id: id des anzuzeigenden Beitrags (aus Funktionsparameter)
      //   beitragDiv: div-Element, in dem der Beitrag angezeigt werden soll (aus Funktionsparameter)
      beitragHolenUndAnzeigen(id, beitragDiv);
    })
    .catch(function(error) {
      console.log('Error: ' + error.message);
    });
}
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// ::: Datenänderung C: vorhandenen Beitrag aus Datenbank löschen

/* ** Funktion: beitragLoeschen(...) **
* Beschreibung
*   schickt die id des zu löschenden Beitrags an loescheBeitrag.php
* Parameter
*   beitrag:    Beitrags-Objekt des zu löschenden Beitrags
*   beitragDiv: div-Element, in welchem der neue Beitrag erscheinen soll
* Funktion, auf welche die Datenänderung C zugreift
*   --
* PHP-Datei, auf welche die Datenänderung B zugreift
*   loescheBeitrag.php
*/
function beitragLoeschen(beitrag, beitragDiv){
  // formData: Objekt mit Schlüssel/Werte-Paaren zur Übertragung von Daten per POST
  let formData = new FormData();
  // Jede Zeile fügt ein Schlüssel/Werte-Paar hinzu.
  // ............('Schlüssel', Wert);
  formData.append('beitragID', beitrag.id); // Wert aus Beitrags-Objekt
  fetch("system/ajax/loescheBeitrag.php",
    {
        body: formData,  // body:   Objekt mit zu übertranden Daten
        method: "post"   // method: Art der Übertragung (get/post)
    })
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      //console.log(data);
      // Wenn wir in der Deteil-Ansicht sind ...
      if(rubrik == "eine Frage mit Antworten"  && beitrag.uebergeordnete_id == 0){
        // Überblick anzeigen (1. Ansicht)
        alleFragenHolen();
      }else{ // ... sonst
        // beitragDiv aus Ansicht entfernen
        beitragDiv.remove();
      }
    })
    .catch(function(error) {
      console.log('Error: ' + error.message);
    });
}
// -----------------------------------------------------------------------------
// =============================================================================================
