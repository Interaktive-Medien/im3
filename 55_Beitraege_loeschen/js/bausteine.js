
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
  beitragDiv.innerHTML = "";

  // Titel und Inhalt
  let beitragTitel = document.createElement('h4');
  beitragTitel.textContent = beitrag.titel;
  beitragDiv.appendChild(beitragTitel);

  let beitragInhalt = document.createElement('p');
  beitragInhalt.textContent = beitrag.inhalt;
  beitragDiv.appendChild(beitragInhalt);


  // Optionaler Detaillink
  if(rubrik == "alle Fragen"){
    detalLinkAnzeigen(beitragDiv, beitrag);
  }

  // Buttons zum bearbeiten und löschen anzeigen
  // !!! ACHTUNG: nur, wenn user eingeloggt und  Autor des Beitrags ist
  if( user.id != 0 && beitrag.autor_id == user.id ){
    // bearbeiten Button
    let beitragEditBtn = document.createElement('button');
    beitragEditBtn.textContent = "bearbeiten";
    beitragEditBtn.addEventListener("click", function(){
      beitragErstellenOderBearbeiten(beitragDiv, beitrag);
    })
    beitragDiv.appendChild(beitragEditBtn);

    // löschen Button
    let beitragLoeschenBtn = document.createElement('button');
    beitragLoeschenBtn.textContent = "löschen";
    beitragLoeschenBtn.addEventListener("click", function(){
      beitragLoeschenAnzeigen(beitragDiv, beitrag);
    })
    beitragDiv.appendChild(beitragLoeschenBtn);
  }
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
  beitragDiv.innerHTML = "";

  // --- FORMULARFELDER ERSTELLEN ---
  // Titel
  let titelDiv = document.createElement('div');
  beitragDiv.appendChild(titelDiv);

  let titelInputLabel = document.createElement('label');
  titelInputLabel.textContent = "Titel ";
  titelDiv.appendChild(titelInputLabel);

  let titelInput = document.createElement('input');
  titelInput.setAttribute("required", "");
  titelInputLabel.appendChild(titelInput);


  // Inhalt
  let inhaltDiv = document.createElement('div');
  beitragDiv.appendChild(inhaltDiv);

  let textInputLabel = document.createElement('label');
  textInputLabel.textContent = "Text ";
  inhaltDiv.appendChild(textInputLabel);

  let inhaltTextarea = document.createElement('textarea');
  inhaltTextarea.setAttribute("required", "");
  textInputLabel.appendChild(inhaltTextarea);

  // ---  FORMULARFELDER FÜLLEN ---

  // nur, wenn der Funktion ein Beitrag mitgegeben wurde
  if(beitrag != null){
    titelInput.setAttribute("value", beitrag.titel);
    inhaltTextarea.textContent = beitrag.inhalt;
  }

  // -- BUTTONS ---
  // Abbrechen-Button
  let abbrechenBtn = document.createElement('button');
  abbrechenBtn.textContent = "abbrechen";
  abbrechenBtn.addEventListener("click", function(){
    if(beitrag != null){
      beitragAnzeigen(beitragDiv, beitrag);
    } else {
      beitragDiv.remove();
    }
  })
  beitragDiv.appendChild(abbrechenBtn);

  // Speichern-Button
  let speichernBtn = document.createElement('button');
  speichernBtn.textContent = "speichern";
  speichernBtn.addEventListener("click", function(){
    if(beitrag != null){
      beitragAktualisieren(beitrag.id, titelInput.value, inhaltTextarea.value, beitragDiv)
    } else {
      neuenBeitragSpeichern( titelInput.value, inhaltTextarea.value, beitragDiv)
    }
  })
  beitragDiv.appendChild(speichernBtn);
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
  /*
  beitragDiv.innerHTML = "";
  beitragDiv.classList.add("loeschen");

  // Titel und Inhalt
  let beitragTitel = document.createElement('h1');
  beitragTitel.textContent = beitrag.titel;
  beitragDiv.appendChild(beitragTitel);

  let beitragInhalt = document.createElement('h3');
  beitragInhalt.textContent = beitrag.inhalt;
  beitragDiv.appendChild(beitragInhalt);

  // Buttons
  // Abbrechen Button
  let abbrechenBtn = document.createElement('button');
  abbrechenBtn.textContent = "abbrechen";
  abbrechenBtn.addEventListener("click", function(){
    beitragDiv.classList.remove("loeschen");
    beitragAnzeigen(beitragDiv, beitrag);
  })
  beitragDiv.appendChild(abbrechenBtn);

  // endgültig löschen Button
  let endgueltigLoeschenBtn = document.createElement('button');
  endgueltigLoeschenBtn.textContent = "endgülig löschen";
  endgueltigLoeschenBtn.addEventListener("click", function(){
    beitragLoeschen(beitrag, beitragDiv)
  })
  beitragDiv.appendChild(endgueltigLoeschenBtn);
  */
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
    let detailDiv = document.createElement('div');
    let detailLink = document.createElement('a');
    detailLink.setAttribute("href", "#");
    detailLink.textContent = "... Details";
    detailLink.addEventListener("click", function(event){
      event.preventDefault();
      frageMitAntwortenHolen(beitrag.id);
    });

    detailDiv.appendChild(detailLink);
    beitragDiv.appendChild(detailDiv);
//  }
  // ENDE Detail-Link anzeigen
}

// =============================================================================================
