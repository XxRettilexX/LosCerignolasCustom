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
![WhatsApp Image 2025-10-23 at 19 17 56](https://github.com/user-attachments/assets/68623421-12b7-4fd2-b1ea-2919e0ac8bb9)

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

## 📋 Casi d’Uso Principali

### 1️⃣ Autenticazione
Il cliente accede all’app tramite **login**.  
- Senza autenticazione non può accedere alla raccolta punti.
- Alternativa: il cliente può effettuare ordini tramite app.

### 2️⃣ Navigazione tra le schermate
Il cliente naviga tra le sezioni dell’app tramite la **Bottom Tab Bar** o la **navigazione a stack**.  
- Alternativa: l’utente può tornare alla pagina principale tramite lo stack navigation.

### 3️⃣ Visualizzazione menù e prodotti
Il cliente esplora i menù disponibili e visualizza i dettagli dei prodotti.  
- Estensione: possibilità di **filtrare i prodotti** o **cercare per nome**.

### 4️⃣ Logout / Gestione sessione
L’utente può uscire dall’app.  
- L’app effettua il **reset dello stack di navigazione** per proteggere la sessione.
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

