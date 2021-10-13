// !!!!!!!!!! Wird beim laden der Seite ausgeführt !!!!!!!!!!

// HTML-Elemente in JS-Variablen speichern
let inhalt = document.querySelector('#forum_inhalt');
let ueberschrift = document.querySelector('#ueberschrift');


// im gesamten Script zugängliche Hauptvariablen
let user = {};
let uebergeordneteId = 0;
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
      user = userData;

      let userStatus = document.querySelector('#userStatus');
      let loginLink = document.querySelector('#loginLink');
      let registrierenLink = document.querySelector('#registrierenLink');
      if(user.id == 0){
        userStatus.textContent = "anonymer User";
        loginLink.textContent = "Anmelden";
      } else {
        userStatus.textContent = user.vorname + " " + user.nachname;
        loginLink.textContent = "Logout";
        registrierenLink.remove();
      }
      alleFragenHolen();
    })
    .catch(function(error) {
      console.log('Error: ' + error.message);
    });
}


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
  inhalt.innerHTML = "";
  rubrikAendern("alle Fragen");
  uebergeordneteId = 0;

  // Fragen anzeigen
  for(let i = 0; i < alleFragenObj.length; i++){
    let frageDiv = document.createElement('div');
    frageDiv.setAttribute("class", "frage");
    beitragAnzeigen(frageDiv, alleFragenObj[i]);
    inhalt.appendChild(frageDiv);
  }

  // Button für neue Frage

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
  inhalt.innerHTML = "";
  rubrikAendern(rubrikName = "eine Frage mit Antworten")

  // Frage
  let frage = frageUndAntwortenObj.frage;
  uebergeordneteId = frage.id;

  let frageUndAntwortenDiv = document.createElement('div');
  frageUndAntwortenDiv.setAttribute("class", "frage");
  inhalt.appendChild(frageUndAntwortenDiv);

  let frageDiv = document.createElement('div');
  beitragAnzeigen(frageDiv, frage);
  frageUndAntwortenDiv.appendChild(frageDiv);

  // Antworten
  let antworten = frageUndAntwortenObj.antworten;
  for(let i = 0; i < antworten.length; i++){
    let antwortDiv = document.createElement('div');
    antwortDiv.setAttribute("class", "antwort");
    beitragAnzeigen(antwortDiv, antworten[i]);
    frageUndAntwortenDiv.appendChild(antwortDiv);
  }

  // Button für neue Antwort

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

}


// -----------------------------------------------------------------------------
// ::: Datenänderung B: vorhandenen Beitrag in Datenbank aktualisieren
function beitragAktualisieren(id, titel, inhalt, beitragDiv){

}
// -----------------------------------------------------------------------------


// ::: Datenänderung C: vorhandenen Beitrag aus Datenbank löschen
function beitragLoeschen(beitrag, beitragDiv){

}
