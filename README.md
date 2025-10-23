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

---

## 🎯 Obiettivo

L’obiettivo principale del progetto è creare un’app **semplice e funzionale** che consenta all’utente di:

- 🍽️ Navigare tra i diversi menù  
- 👀 Visualizzare i prodotti disponibili  
- 🔐 Gestire la propria sessione in modo sicuro e fluido  

---

## ⚙️ Funzionalità principali

### 🔐 Flusso di Autenticazione
Schermata di login per proteggere l’accesso all’area principale dell’app.

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
- Senza autenticazione non può inserire i prodotti nel carrello.  
- Alternative: recupero password o messaggio di errore se credenziali errate.

### 2️⃣ Navigazione tra le schermate
Il cliente naviga tra le sezioni dell’app tramite la **Bottom Tab Bar** o la **navigazione a stack**.  
- Alternativa: l’utente può tornare alla pagina principale tramite lo stack navigation.

### 3️⃣ Visualizzazione menù e prodotti
Il cliente esplora i menù disponibili e visualizza i dettagli dei prodotti.  
- Estensione: possibilità di **filtrare i prodotti** o **cercare per nome**.

### 4️⃣ Logout / Gestione sessione
L’utente può uscire dall’app.  
- L’app effettua il **reset dello stack di navigazione** per proteggere la sessione.

---

