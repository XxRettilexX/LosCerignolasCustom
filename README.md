# 🌮 Los Cerignola

**Los Cerignola** è un’app sviluppata con **React Native (Expo)** che permette di esplorare in modo intuitivo i menù disponibili e visualizzare i prodotti offerti da una pizzeria.

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

## 🐔 Mascotte — “Cerigno”

**Cerigno** è la mascotte ufficiale di *Los Cerignola*:  
un simpatico **pollo pizzaiolo** con cappello da chef, sempre pronto a sfornare pizze perfette! 🍕🔥  
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
<img width="355" height="281" alt="CU1" src="https://github.com/user-attachments/assets/58373302-a13b-4eb2-a268-8e0d864ea24e" width="50%" />

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

---

### 2.2 🍽️ Esplorazione Menù (Cliente)

**Utente:** Cliente autenticato  
**Schermata:** `Menù`  
**Flusso:**
- Identico al caso d’uso *1.1*, ma con utente loggato.

---

### 2.3 💸 Finalizzazione Ordine e Accumulo Punti

**Utente:** Cliente  
**Schermata:** `Carrello / Checkout`  
**Flusso:**
1. Il cliente accede al carrello (dati precompilati).
2. Conferma l’ordine.

**Post-condizione:**
- L’ordine viene salvato nello *Storico Ordini*.
- Il sistema assegna **1 punto per ogni Euro speso**.

---

### 2.4 🧾 Consultazione Storico Ordini

**Utente:** Cliente  
**Schermata:** `Ordini`  
**Flusso:**
1. Il cliente seleziona *Ordini* dalla Bottom Tab Bar.
2. Visualizza l’elenco cronologico degli ordini effettuati.
3. Può toccare un ordine per visualizzare i dettagli (prodotti, prezzo, punti accumulati).

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
2. L'app cancella la sessione, resetta lo stack di navigazione e torna allo stato *Guest*.

---

## 🧩 Riassunto Percorsi

| Stato Utente | Accesso Funzionalità | Punti Fedeltà | Storico Ordini | Riscatto Premi |
|---------------|----------------------|----------------|----------------|----------------|
| **Guest** | Menù, Carrello, Checkout | ❌ | ❌ | ❌ |
| **Cliente** | Home, Menù, Ordini, Profilo | ✅ | ✅ | ✅ |

---

<img width="479" height="648" alt="uml2" src="https://github.com/user-attachments/assets/db9795c0-9213-4c0b-862d-31239301a848" />

# ⚙️ Good & Bad Practice

## ✅ Good Practice
- **Autenticazione sicura e fluida**  
  Gestione chiara di login, errori e recupero password.
- **Navigazione coerente**  
  Uso combinato di *Bottom Tab Bar* e *Stack Navigation*, con percorsi prevedibili e coerenti.
- **Sessione protetta**  
  Reset completo dello stack dopo il logout e invalidazione del token utente.
- **Esperienza utente curata**  
  Feedback visivi, messaggi chiari e attenzione all’accessibilità.

---

## ❌ Bad Practice
- **Login forzato senza contesto**  
  Obbligare l’utente ad autenticarsi subito, senza contenuti introduttivi.
- **Navigazione confusa**  
  Percorsi duplicati o mancanza del pulsante “indietro”.
- **Gestione sessione inefficace**  
  Possibilità di tornare a schermate protette dopo il logout.
- **Assenza di feedback**  
  Nessuna indicazione durante caricamenti o errori
---

