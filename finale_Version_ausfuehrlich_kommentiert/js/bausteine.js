
// =============================================================================================
// !!!!!!!!!! Bausteine !!!!!!!!!!
// werden von Ansichten aufgerufen

// -----------------------------------------------------------------------------
// ::: Baustein A: Beitrag anzeigen

/* ** Funktion: beitragAnzeigen(...) **
* Beschreibung
*   zeigt Titel und Inhalt eines Beitrags und
*   bei eingeloggten Usern Buttons zum bearbeiten bzw. löschen ihres eigenen Beitrags
* Parameter
*   beitragDiv: div-Element, in welchem der Beitrag angezeigt werden soll
*   beitrag:    aktuelles Beitrags-Objekt mit Beitragsinhalten
*               Bezeichner in Objekt: Spaltenname der DB
* Funktionen, auf die der Baustein zugreift
*   frageMitAntwortenHolen( beitrag.id )                    -> Ansicht B
*   beitragErstellenOderBearbeiten( beitragDiv , beitrag )  -> Baustein B
*   beitragLoeschenAnzeigen( beitragDiv , beitrag )         -> Baustein C
*/
function beitragAnzeigen(beitragDiv, beitrag){
  // löschen des aktuellen Inhalts des beitragDiv
  beitragDiv.innerHTML = "";

    // .................................................................................
  // neues h4-Element "beitragTitel" für Titel des Beitrags
  let beitragTitel = document.createElement('h4');
  // Titel des Beitrags in beitragTitel (h4-Element) schreiben
  beitragTitel.textContent = beitrag.titel;
  // beitragTitel an beitragDiv anhängen (wird jetzt auf Seite angezeigt)
  beitragDiv.appendChild(beitragTitel);

  // neues p-Element "beitragInhalt" für Inhalt des Beitrags
  let beitragInhalt = document.createElement('p');
  // Inhalt des Beitrags in beitragInhalt (p-Element) schreiben
  beitragInhalt.textContent = beitrag.inhalt;
  // beitragInhalt an beitragDiv anhängen (wird jetzt auf Seite angezeigt)
  beitragDiv.appendChild(beitragInhalt);


  // In der Rubrik "alle Fragen" soll in jedem Beitrag ein Link eingeblendet werden,
  // der zur entsprechenden Frage mit allen Antworten führt
  if(rubrik == "alle Fragen"){
    // Aufruf der Funktion zur Darstellung des Links zur Detailansicht eines Beitrags
    // Parameter
    //   beitragDiv: Element, in welchem der Beitrag angezeigt werden soll
    //   beitrag: Beitrags-Objekt mit Inhalten
    detalLinkAnzeigen(beitragDiv, beitrag);
  }

  // .................................................................................
  // Buttons zum bearbeiten und löschen anzeigen
  // !!! ACHTUNG: werden nur angezeigt, wenn user eingeloggt (user.id != 0)
  //              und (&&) Autor des Beitrags ist (beitrag.autor_id == user.id)
  if( user.id != 0 && beitrag.autor_id == user.id ){
      // .................................................................................
    // neues button-Element "beitragEditBtn"
    let beitragEditBtn = document.createElement('button');
    // Beschriftung des beitragEditBtn
    beitragEditBtn.textContent = "bearbeiten";
    // bei Event "click" auf beitragEditBtn ...
    beitragEditBtn.addEventListener("click", function(){
      // Aufruf der Funktion zur (Erstellung oder) Bearbeitung eines Beitrags
      // Parameter
      //   beitragDiv: div-Element, in welchem der Beitrag bearbeitet werden soll (wo)
      //   beitrag: aktuelles Objekt, das bearbeitet werden soll (was)
      beitragErstellenOderBearbeiten(beitragDiv, beitrag);
    })
    // beitragEditBtn an beitragDiv anhängen (wird jetzt auf Seite angezeigt)
    beitragDiv.appendChild(beitragEditBtn);

    // .................................................................................
    // neues button-Element "beitragLoeschenBtn" mit dem Link
    let beitragLoeschenBtn = document.createElement('button');
    // Beschriftung des beitragLoeschenBtn
    beitragLoeschenBtn.textContent = "löschen";
    // bei Event "click" auf beitragLoeschenBtn ...
    beitragLoeschenBtn.addEventListener("click", function(){
      // Aufruf der Funktion zur Erstellung (oder Bearbeitung) eines Beitrags
      // Parameter
      //   neuFrageDiv: Element, in welchem der Beitrag (Antwort) angezeigt werden soll
      beitragLoeschenAnzeigen(beitragDiv, beitrag);
    })
    // beitragLoeschenBtn an beitragDiv anhängen (wird jetzt auf Seite angezeigt)
    beitragDiv.appendChild(beitragLoeschenBtn);
  }
  // ENDE Buttons zum bearbeiten und löschen anzeigen
}
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// ::: Baustein B: neuen Beitrag erstellen oder bestehenden Beitrag bearbeiten

/* ** Funktion: beitragErstellenOderBearbeiten(...) **
* Beschreibung
*   erstellt ein Formular mit
*     Formularfeld: input-Feld für den Beitrags-Titel
*     Formularfeld: Textarea für den Beitrags-Inhalt
*     Button:       abbrechenBtn
*     Button:       speichernBtn
*   Beim bearbeiten eines bestehenden Beitrags werden die Formularfelder
*   mit den entsprechenden Inhalten gefüllt.
*   Beim Click auf Speichern werden die Aktualisierung eines bestehenden Beitags
*   und die Speicherung eines neuen Beitrags jeweils unterschiedliche Funktionen aufgerufen.
* Parameter
*   beitragDiv:           div-Element, in welchem der Beitrag erstellt
*                         oder bearbeitet werden soll
*   beitrag (optional):   nur für Bearbeitung bestehender Beiträge - sonst null
*                         aktuelles Objekt mit Beitragsinhalten, die bearbeitet werden sollen
*                         Bezeichner in Objekt: Spaltenname der DB
* Funktionen, auf die der Baustein zugreift
*   beitragAnzeigen( ... )       : Baustein A
*   beitragAktualisieren( ... )  : Datenänderung B
*   neuenBeitragSpeichern( ... ) : Datenänderung A
*/
function beitragErstellenOderBearbeiten(beitragDiv, beitrag = null){
  // löschen des aktuellen Inhalts des beitragDiv
  beitragDiv.innerHTML = "";

  // --- FORMULARFELDER ERSTELLEN ---

  // Formularfeld "Titel"
  // neues div-Element "titelDiv" (damit Formularfeld mit Beschriftung in eigener Zeile steht)
  let titelDiv = document.createElement('div');
  // titelDiv an beitragDiv anhängen (wird jetzt auf Seite angezeigt)
  beitragDiv.appendChild(titelDiv);

  // neues label-Element "titelInputLabel" (Beschriftung für Titel)
  let titelInputLabel = document.createElement('label');
  // Beschriftung in titelInputLabel schreiben
  titelInputLabel.textContent = "Titel ";
  // titelInputLabel an titelDiv anhängen (wird jetzt auf Seite angezeigt)
  titelDiv.appendChild(titelInputLabel);

  // neues input-Element "titelInput" (für Titel-Text)
  let titelInput = document.createElement('input');
  // required-Attribut für titelInput - Eingabe wir erzwungen
  titelInput.setAttribute("required", "");
  // titelInput an titelInputLabel anhängen (wird jetzt auf Seite angezeigt)
  titelInputLabel.appendChild(titelInput);


  // Formularfeld "Inhalt"
  // neues div-Element "inhaltDiv" (damit Formularfeld mit Beschriftung in eigener Zeile steht)
  let inhaltDiv = document.createElement('div');
  // inhaltDiv an beitragDiv anhängen (wird jetzt auf Seite angezeigt)
  beitragDiv.appendChild(inhaltDiv);

  // neues label-Element "textInputLabel" (Beschriftung für Inhalt)
  let textInputLabel = document.createElement('label');
  // Beschriftung in textInputLabel schreiben
  textInputLabel.textContent = "Text ";
  // textInputLabel an inhaltDiv anhängen (wird jetzt auf Seite angezeigt)
  inhaltDiv.appendChild(textInputLabel);

  // neues textarea-Element "inhaltTextarea" (für Inhalt-Text)
  let inhaltTextarea = document.createElement('textarea');
  // required-Attribut für inhaltTextarea - Eingabe wir erzwungen
  inhaltTextarea.setAttribute("required", "");
  // inhaltTextarea an textInputLabel anhängen (wird jetzt auf Seite angezeigt)
  textInputLabel.appendChild(inhaltTextarea);

  // --- ENDE FORMULARFELDER ERSTELLEN ---

  // ---  FORMULARFELDER FÜLLEN ---

  // wenn es einen Beitrag gibt (Bearbeitung)
  // nicht bei Erstellung eines Beitrags
  if(beitrag != null){
    // value-Attribut für titelInput mit titel-Wert aus zu bearbeitendem Beitrag füllen
    // wird dann im Eingabe-Feld angezeigt
    titelInput.setAttribute("value", beitrag.titel);
    // inhalt der inhaltTextarea mit inhalt-Wert aus zu bearbeitendem Beitrag füllen
    // wird dann im Eingabe-Feld angezeigt
    inhaltTextarea.textContent = beitrag.inhalt;
  }

  // --- ENDE FORMULARFELDER FÜLLEN ---


  // -- BUTTONS ---

  // Abbrechen-Button
  // neues button-Element "abbrechenBtn"
  let abbrechenBtn = document.createElement('button');
  // Beschriftung des abbrechenBtn
  abbrechenBtn.textContent = "abbrechen";
  // bei Event "click" auf abbrechenBtn ...
  abbrechenBtn.addEventListener("click", function(){
    // wenn es einen Beitrag gibt (nicht null) (bei Bearbeitung)
    if(beitrag != null){
      // Aufruf der Funktion zur Darstellung eines Beitrags
      // Parameter
      //   beitragDiv: Element, in welchem der Beitrag (Frage) angezeigt werden soll
      //   beitrag: Beitrags-Objekt mit Inhalten
      // vorhandener Beitrag wird ohne Änderungen wiederhergestellt
      beitragAnzeigen(beitragDiv, beitrag);
    } else { // sonst (bei neuem Beitrag)
      // beitragDiv aus Ansicht entfernen, keine Speicherung
      beitragDiv.remove();
    }

  })
  // abbrechenBtn an beitragDiv anhängen (wird jetzt auf Seite angezeigt)
  beitragDiv.appendChild(abbrechenBtn);

  // Speichern-Button
  // neues button-Element "speichernBtn"
  let speichernBtn = document.createElement('button');
  // Beschriftung des speichernBtn
  speichernBtn.textContent = "speichern";
  // bei Event "click" auf speichernBtn ...
  speichernBtn.addEventListener("click", function(){
    // wenn es einen Beitrag gibt (nicht null) (bei Bearbeitung)
    if(beitrag != null){
      // Aufruf der Funktion zur Speicherung des aktualisierten Beitrags
      // Parameter
      //   beitrag.id:           id des zu aktualisierenden Beitrags
      //   titelInput.value:     Wert aus titelInput (Titel des Beitrags)
      //   inhaltTextarea.value: Wert aus inhaltTextarea (Inhalt des Beitrags)
      //   beitragDiv:           div, in dem der aktualisierte Beitrag angezeigt werden soll
      // aktualisieter Beitrag wird mit Änderungen im selben div angezeigt
      beitragAktualisieren(beitrag.id, titelInput.value, inhaltTextarea.value, beitragDiv)
    } else { // sonst (bei neuem Beitrag)
      // Aufruf der Funktion zur Speicherung eines neuen Beitrags
      // Parameter
      //   titelInput.value:     Wert aus titelInput (Titel des Beitrags)
      //   inhaltTextarea.value: Wert aus inhaltTextarea (Inhalt des Beitrags)
      //   beitragDiv:           div, in dem der neue Beitrag angezeigt werden soll
      // neuer Beitrag wird im selben div angezeigt
      neuenBeitragSpeichern( titelInput.value, inhaltTextarea.value, beitragDiv)
    }
  })
  // speichernBtn an beitragDiv anhängen (wird jetzt auf Seite angezeigt)
  beitragDiv.appendChild(speichernBtn);

  // -- ENDE BUTTONS ---
}
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// ::: Baustein C: vorhandenen Beitrag tatsächlich löschen

/* ** Funktion: beitragLoeschenAnzeigen(...) **
* Beschreibung
*   zeigt Titel und Inhalt eines Beitrags auf rotem Hintergrund und
*   Buttons zum abbrechen, bzw. engültigen löschen eines Beitrags
* Parameter
*   beitragDiv: div-Element, in welchem der zu löschende Beitrag angezeigt wird
*   beitrag :   Beitrags-Objekt mit Inhalten des zu löschenden Beitrags
* Funktionen, auf die der Baustein zugreift
*   beitragAnzeigen( ... )  : Baustein A
*   beitragLoeschen( ... )  : Datenänderung C
*/
function beitragLoeschenAnzeigen(beitragDiv, beitrag){
  // beitragDiv leeren
  beitragDiv.innerHTML = "";
  // beitragDiv class "loeschen" hinzufügen (roter Hintergrund, Text zentriert)
  beitragDiv.classList.add("loeschen");

  // neues h1-Element "beitragTitel" für Titel des Beitrags
  let beitragTitel = document.createElement('h1');
  // Titel des Beitrags in beitragTitel schreiben
  beitragTitel.textContent = beitrag.titel;
  // beitragTitel an beitragDiv anhängen (wird jetzt auf Seite angezeigt)
  beitragDiv.appendChild(beitragTitel);

  // neues h3-Element "beitragInhalt" für Titel des Beitrags
  let beitragInhalt = document.createElement('h3');
  // Inhalt des Beitrags in beitragInhalt schreiben
  beitragInhalt.textContent = beitrag.inhalt;
  // beitragInhalt an beitragDiv anhängen (wird jetzt auf Seite angezeigt)
  beitragDiv.appendChild(beitragInhalt);

  // neues button-Element "abbrechenBtn"
  let abbrechenBtn = document.createElement('button');
  // Beschriftung des abbrechenBtn
  abbrechenBtn.textContent = "abbrechen";
  // bei Event "click" auf abbrechenBtn ...
  abbrechenBtn.addEventListener("click", function(){
    // beitragDiv class "loeschen" entfernen
    beitragDiv.classList.remove("loeschen");
    // Aufruf der Funktion zur Darstellung eines Beitrags
    // Parameter
    //   beitragDiv: Element, in welchem der Beitrag (Frage) angezeigt werden soll
    //   beitrag: Beitrags-Objekt mit Inhalten
    // vorhandener Beitrag wird ohne Änderungen wiederhergestellt
    beitragAnzeigen(beitragDiv, beitrag);
  })
  // abbrechenBtn an beitragDiv anhängen (wird jetzt auf Seite angezeigt)
  beitragDiv.appendChild(abbrechenBtn);

  // neues button-Element "endgueltigLoeschenBtn"
  let endgueltigLoeschenBtn = document.createElement('button');
  // Beschriftung des endgueltigLoeschenBtn
  endgueltigLoeschenBtn.textContent = "endgülig löschen";
  // bei Event "click" auf endgueltigLoeschenBtn ...
  endgueltigLoeschenBtn.addEventListener("click", function(){
    // Aufruf der Funktion zur endgültigen Löschung eines Beitrags aus der DB
    // Parameter
    //   beitrag: Beitrags-Objekt des zu löschenden Beitrags
    //   beitragDiv: Element, in dem der zu löschende Beitrag momentan steht
    // Beitrag wird gelöscht
    beitragLoeschen(beitrag, beitragDiv)
  })
  // endgueltigLoeschenBtn an beitragDiv anhängen (wird jetzt auf Seite angezeigt)
  beitragDiv.appendChild(endgueltigLoeschenBtn);
}
// -----------------------------------------------------------------------------



// -----------------------------------------------------------------------------
// ::: Baustein D: Details-Link anzeigen

/* ** Funktion: detalLinkAnzeigen(...) **
* Beschreibung
*   Link zu einer Frage mit allen Antworten
* Parameter
*   beitragDiv: div-Element, in welchem der zu löschende Beitrag angezeigt wird
*   beitrag :   Beitrags-Objekt mit Inhalten des zu löschenden Beitrags
* Funktionen, auf die der Baustein zugreift
*   frageMitAntwortenHolen( ... )  : Ansicht B
*/
function detalLinkAnzeigen(beitragDiv, beitrag){
  // .................................................................................
  // Details-Link anzeigen
  // !!! ACHTUNG: wird nur auf der Übersichts-Seite angezeigt (Rubrik: alle Fragen)
  //if(rubrik == "alle Fragen"){
    // neues div-Element "detailDiv" (damit Link in eigener Zeile steht)
    let detailDiv = document.createElement('div');
    // neues a-Element "detailLink" mit dem Link
    let detailLink = document.createElement('a');
    // href-Attribut für "detailLink" damit der Link als solcher erkennbar ist
    detailLink.setAttribute("href", "#");
    // Lintext in detailLink (a-Element) schreiben
    detailLink.textContent = "... Details";
    // bei Event "click" auf detailLink ...
    detailLink.addEventListener("click", function(event){
      // Standard-Verhalten für Link unterbinden
      event.preventDefault();
      // Funktion frageMitAntwortenHolen(...) aufrufen
      // Parameter
      //   beitrag.id: id des aktuellen Beitrags (2. Ansicht: Detail)
      frageMitAntwortenHolen(beitrag.id);
    });

    // detailLink an detailDiv anhängen (wird jetzt auf Seite angezeigt)
    detailDiv.appendChild(detailLink);
    // detailDiv an beitragDiv anhängen (wird jetzt auf Seite angezeigt)
    beitragDiv.appendChild(detailDiv);
//  }
  // ENDE Detail-Link anzeigen
}

// =============================================================================================
