<img width="20%" alt="ChatGPT Image 24 ott 2025, 12_33_06" src="https://github.com/user-attachments/assets/37c1edf6-c4d6-4d6b-a3fd-1d18aaf58af8" /> 


## 🌮 Introduzione

**Los Cerignola** è un’app nata per rendere l’esperienza in pizzeria più semplice e piacevole.  
L’idea è quella di permettere a chiunque, in pochi tocchi, di dare un’occhiata al menù, scegliere cosa ordinare e, se registrato, accumulare punti da usare per ottenere sconti o premi.

L’utente può accedere all’app in modo immediato semplicemente scansionando un **QR code** presente nel locale, senza bisogno di cercare l’app nello store o digitare indirizzi complessi.  

L’app è pensata per funzionare in modo semplice e immediato su qualsiasi telefono.  
Ha un aspetto curato, con colori vivaci e uno stile che mette subito di buon umore.  
Ogni dettaglio è stato scelto per trasmettere la stessa accoglienza e familiarità che si prova entrando in una buona pizzeria: un posto dove ti puoi sentire a casa.

---

## 🎨 Identità Visiva

### 🌈 Palette Colori

| Ruolo | Colore | Codice |
|:------|:--------|:-------|
| **Primario** | 🟡 Giallo | `#FFD60A` |
| **Secondario** | 🔵 Blu | `#004AAD` |
| **Sfondo Chiaro** | ⚪ Crema | `#FFF7E0` |
| **Testo / Contrasto** | ⚫ Blu Notte | `#001D3D` |

---

## 🐔 Cerigno – La Mascotte di Los Cerignola

**Cerigno** è il volto e l’anima di Los Cerignola: un pollo pizzaiolo simpatico e pieno di energia, sempre con il cappello da chef e pronto a sfornare pizze perfette! 🍕🔥  

Cerigno rappresenta **allegria e accoglienza**.  
È stato scelto perché vuole rendere l’app **più divertente**, accompagnando l’utente in ogni schermata e trasmettendo la stessa familiarità e calore che si prova entrando in una pizzeria.  

In pratica, Cerigno non è solo un’icona: è un piccolo ambasciatore del brand, che crea **connessione emotiva** con chi usa l’app e rende l’esperienza digitale più coinvolgente.

<img src="https://github.com/user-attachments/assets/68623421-12b7-4fd2-b1ea-2919e0ac8bb9" alt="Cerino" width="50%"/>

---

## 🎯 Obiettivo

L’obiettivo principale del progetto è creare un’app **semplice e funzionale** che consenta all’utente di:

- 🍽️ Navigare tra i diversi menù  
- 👀 Visualizzare i prodotti disponibili
- 💰 Completare acquisti **in app**
- ⭐ Accumulare punti con gli acquisti per vincere **promozioni e sconti** 
- 🔐 Gestire la propria sessione in modo sicuro e fluido


---

## ⚙️ Funzionalità principali

### 🔐 Flusso di Autenticazione
Schermata di login per proteggere l’accesso all’area principale dell’app e permette all’utente di **tenere traccia dei punti accumulati** e di **riscattare le promozioni** ottenute attraverso gli acquisti.

### 📚 Navigazione a Stack
Gestione della navigazione gerarchica tra le schermate (es. lista prodotti → dettaglio prodotto).

### 📱 Navigazione a Schede (Tabs)
Una comoda **Bottom Tab Bar** per muoversi tra le sezioni principali: **Home**, **Ordini** e **Profilo**.

### 🔄 Gestione della Sessione
Utilizzo del **reset dello stack di navigazione** per garantire un’esperienza di login/logout senza interruzioni.

### 🛒 Gestione degli Acquisti
Possibilità di acquisto tramite **carrello interattivo**.

### 📍 Gestione della Posizione
Visualizzazione sulla mappa dei **punti vendita più vicini** al cliente.

---

# 📱 Casi d’Uso – Applicazione

L'applicazione prevede due percorsi di utilizzo principali, basati sullo **stato di autenticazione** dell'utente.

- **Percorso Guest (Non Autenticato)** → Permette esclusivamente di navigare il menù e completare un ordine.
- **Percorso Cliente (Autenticato)** → Sblocca tutte le funzionalità, inclusa la raccolta punti, lo storico ordini e la riscossione di premi.

---

## 🚀 Avvio dell'Applicazione

All'avvio, l'app verifica lo stato di autenticazione dell'utente:

- **Se NON Autenticato (Guest)** → Avvia il *Percorso Guest*, con navigazione limitata (es. solo *Menù* e *Carrello*).  
- **Se Autenticato (Cliente)** → Avvia il *Percorso Cliente*, con navigazione completa (es. *Home*, *Menù*, *Ordini*, *Profilo*).

---

## 🚶‍♂️ Percorso Guest (Non Autenticato)

### 🎯 Obiettivo
Effettuare un ordine rapido **senza registrazione**.

---

### 1.1 🍽️ Esplorazione Menù (Guest)

**Utente:** Guest  
**Schermata:** `Menù`  
**Flusso:**
1. L’utente visualizza le categorie e i prodotti.
2. Tocca un prodotto per visualizzarne i dettagli.
3. Aggiunge il prodotto al carrello.
<img width="745" height="567" alt="CU1 1" src="https://github.com/user-attachments/assets/7eef458d-8631-4bb8-9459-f5b7b2ad9a7b" width="50%"/>


---

### 1.2 🛒 Finalizzazione Ordine (Guest)

**Utente:** Guest  
**Schermata:** `Carrello / Checkout`  
**Flusso:**
1. L’utente accede al carrello e visualizza il riepilogo.
2. Inserisce manualmente i dati richiesti (es. nome, telefono, indirizzo).
3. Conferma l’ordine.

**Post-condizione:**
- L’ordine viene inviato.
- Nessun punto fedeltà viene accumulato.
- L’ordine non viene salvato nello storico.
<img width="841" height="509" alt="CU1 2" src="https://github.com/user-attachments/assets/b5790788-ec6d-455f-b185-e3209defa989" width="50%"/>

---

## ⭐️ Percorso Cliente (Autenticato)

### 🎯 Obiettivo
Gestire il proprio account, **accumulare punti fedeltà** e **riscattare premi**.

---

### 2.1 🏠 Autenticazione e Home

**Utente:** Cliente  
**Schermata:** `Login / Home`  
**Flusso:**
1. Il cliente inserisce le proprie credenziali.
2. Dopo l’accesso, viene reindirizzato alla Home.

**Contenuto Home:**
- Informazioni personalizzate.
- Promozioni attive.
- Saldo punti attuale.
<img width="952" height="480" alt="CU2 1" src="https://github.com/user-attachments/assets/e3d49c59-e03d-406a-9efd-028557de74d3" width="50%"/>

---

### 2.2 🍽️ Esplorazione Menù (Cliente)

**Utente:** Cliente autenticato  
**Schermata:** `Menù`  
**Flusso:**
- Identico al caso d’uso per il **guest**, ma con utente loggato.
<img width="828" height="480" alt="CU2 2" src="https://github.com/user-attachments/assets/7110fbd8-0a2e-4c61-ad77-08237c9ccabf" width="50%"/>

---

### 2.3 💸 Finalizzazione Ordine e Accumulo Punti

**Utente:** Cliente  
**Schermata:** `Carrello / Checkout`  
**Flusso:**
1. Il cliente accede al carrello.
2. Conferma l’ordine.

**Post-condizione:**
- L’ordine viene salvato nello *Storico Ordini*.
- Il sistema assegna **1 punto per ogni Euro speso**.
<img width="1090" height="655" alt="CU2 3" src="https://github.com/user-attachments/assets/c183356c-6c56-4195-9bb1-e0ca1cdc4be0" width="50%"/>

---

### 2.4 🧾 Consultazione Storico Ordini

**Utente:** Cliente  
**Schermata:** `Ordini`  
**Flusso:**
1. Il cliente seleziona *Ordini* dalla Bottom Tab Bar.
2. Visualizza l’elenco cronologico degli ordini effettuati.
3. Può toccare un ordine per visualizzare i dettagli (prodotti, prezzo, punti accumulati).
<img width="767" height="509" alt="CU2 4" src="https://github.com/user-attachments/assets/e59d4379-e817-45ce-9ca1-9ab65bce3076" width="50%"/>

---

### 2.5 👤 Gestione Profilo, Punti e Logout

**Utente:** Cliente  
**Schermata:** `Profilo Utente`  

#### 🔍 Flusso (Visualizzazione)
- Il cliente apre la sezione *Profilo* e visualizza i propri dati e il saldo punti totale.

#### 🎁 Flusso (Riscossione Buoni)
1. Il cliente preme *Riscatta Buoni*.
2. L'app apre una schermata modale con i premi disponibili.
3. Il cliente seleziona un premio → i punti vengono detratti.

#### 🚪 Flusso (Logout)
1. Il cliente seleziona *Esci*.
2. L'app cancella la sessione, resetta lo stack di navigazione e torna allo stato *Guest*
<img alt="CU2 5" src="https://github.com/user-attachments/assets/b8a9beec-6d3e-4326-9f18-b8556b99a31b" width="50%" />
---

## ⚙️ Good & Bad Practices – Analisi UX di altre applicazioni

L’analisi è stata condotta prendendo come riferimento applicazioni mobile popolari come **Spotify**, **Instagram** e **Duolingo**, osservando come gestiscono autenticazione, navigazione e feedback utente.

---

### ✅ Good Practices

#### 🔐 Autenticazione sicura e fluida
App come **Duolingo** e **Spotify** offrono flussi di login chiari e veloci, con opzioni di **autenticazione tramite Google o Apple**, messaggi d’errore specifici e recupero password intuitivo.
<img alt="Login" src="https://github.com/user-attachments/assets/7ea0feed-42cc-42e0-bd80-b058db81aadd" width="50%" />

#### 🧭 Navigazione coerente
**Spotify** e **Instagram** fanno un uso combinato di **Bottom Tab Bar** e **Stack Navigation**, garantendo percorsi prevedibili, coerenti e un senso di continuità tra le schermate.
<img alt="Bar" src="https://github.com/user-attachments/assets/de301fb1-8f51-4038-a49c-3c5e553502fd" width="50%" />

#### 🛡️ Sessione protetta
Molte app implementano **il reset completo dello stack dopo il logout**, evitando che l’utente possa tornare a schermate private tramite il tasto “indietro”.
<img alt="Logout" src="https://github.com/user-attachments/assets/e25b632e-7f93-4921-a8d4-9d3b097bb9ba" width="50%" />

#### 💬 Esperienza utente curata
App come **Duolingo** si distinguono per i **feedback visivi e sonori**, messaggi chiari e attenzione all’accessibilità (uso corretto dei colori, testo leggibile e contrasto elevato).

---

### ❌ Bad Practices

#### 🚫 Login forzato senza contesto
Alcune app minori obbligano l’utente ad autenticarsi immediatamente, **senza mostrare alcun contenuto introduttivo** o vantaggio del servizio, aumentando l’abbandono iniziale.

#### 🔄 Navigazione confusa
La presenza di **percorsi duplicati**, pulsanti “indietro” incoerenti o la mancanza di una gerarchia chiara nelle schermate (comune in molte app aziendali non ottimizzate) causa disorientamento.

#### 🔓 Gestione sessione inefficace
In certi casi, dopo il logout, è ancora possibile **tornare a schermate protette** tramite la cronologia del dispositivo — un chiaro segno di cattiva gestione dello stato utente.

#### 🕳️ Assenza di feedback
Molte app sottovalutano l’importanza dei **loader**, dei **messaggi di stato** e delle **transizioni fluide**, lasciando l’utente incerto sull’esito di un’azione (es. “Sto caricando...”, “Errore di rete”, ecc.).

---

### 🧠 Conclusione

Le **best practices UX** osservate dimostrano che un’esperienza coerente e sicura nasce da:
- una **navigazione prevedibile**,  
- una **gestione dello stato utente affidabile**,  
- e un **feedback chiaro** in ogni fase del flusso.

Seguendo questi principi, l’app può migliorare **fiducia, fluidità e soddisfazione complessiva** dell’utente.

---
# ⚙️ WireFrame
<img width="1920" height="1080" alt="Dettagli" src="https://github.com/user-attachments/assets/65d93c71-1eb0-46b8-8f45-0805f749c00a" />

**Avvio (Splash Screen)**: Il flusso inizia dalla schermata splash. L'utente ha due opzioni: scansionare il QR code.

**Menù**: L'utente accede alla schermata principale del Menù, dove può visualizzare l'elenco dei prodotti disponibili.

**Dettaglio Prodotto**: Selezionando un prodotto specifico dal menù (come la "Pizza Margherita"), l'utente viene indirizzato alla relativa pagina di Dettaglio Prodotto, che mostra un'immagine ingrandita, il nome, il prezzo e il pulsante "Aggiungi al Carrello".

**Carrello**: Dopo aver premuto "Aggiungi al Carrello", l'utente viene reindirizzato alla schermata Carrello. Questa pagina riepiloga gli articoli scelti (es. "Pizza Margherita" e "Coca-Cola"), mostra il prezzo totale e presenta il pulsante per confermare l'ordine.

Il diagramma mostra anche che dalla schermata Menù è possibile accedere direttamente ad altre due sezioni (probabilmente tramite una barra di navigazione inferiore):

**Alla schermata Profilo** (indicato dal diagramma con la nota "Se loggato").

**Alla schermata Carrello** (indicato con la nota "Se non loggato").

