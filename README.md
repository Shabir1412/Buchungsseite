# Online-Buchungssystem für kleines Hotel

## 1. Projektziel
Ein zentrales, webbasiertes Buchungssystem zur Verwaltung und Online-Buchung von Hotelzimmern mit Echtzeit-Synchronisierung zwischen interner Kalenderverwaltung, Hotel-Homepage und externen Plattformen.

---

## 2. Zimmerstruktur

### Standardzimmer
- 101–105
- 201–205

### Apartments
- 2 Einheiten mit Nummer **301**

### Familienzimmer (Vierbett)
- 11

---

## 3. Funktionsumfang

### 3.1 Zentrale Kalenderansicht
- Tages-, Wochen- und Monatsansicht
- Zimmerweise Darstellung der Belegung
- Sichtbare Personenkapazität je Zimmer
- Anzeige je Buchung:
  - Gastname
  - Aufenthaltszeitraum
  - Anzahl Personen
  - Buchungsdetails (Quelle, Status, Notizen)

### 3.2 Buchungsmaske (für Homepage)
- Direktbuchung über bestehende Hotel-Webseite
- Eingaben:
  - Anreise / Abreise
  - Personenanzahl
  - Kontaktdaten
- Prüfung auf Verfügbarkeit in Echtzeit
- Automatische Eintragung in den zentralen Kalender

### 3.3 Plattformunabhängigkeit
- Vollständig webbasiert
- Optimiert für:
  - Desktop
  - Tablet
  - Smartphone

### 3.4 Schnittstellen und Synchronisierung
- API-Anbindungen (z. B. Booking.com, Hotel-Homepage)
- Bidirektionale Synchronisierung in Echtzeit oder per kurzen Intervallen
- Konfliktvermeidung zur Verhinderung von Doppelbuchungen

---

## 4. Technische Spezifikation (Vorschlag)

### 4.1 Architektur
- **Frontend:** Responsive Web-App (Kalender + Buchungsmaske)
- **Backend/API:** Zentrale Geschäftslogik für Verfügbarkeit, Buchung, Regeln
- **Datenbank:** Persistenz für Zimmer, Belegung, Gäste, Buchungsquellen
- **Integrationsschicht:** Adapter für externe Plattformen + Webhook-Verarbeitung
- **Sync-Engine:** Ereignisgesteuerte Aktualisierung (Events/Webhooks + Queue)

### 4.2 Möglicher Technologie-Stack
- **Frontend:** React + TypeScript + FullCalendar
- **Backend:** Node.js (NestJS/Express) oder Python (FastAPI)
- **Datenbank:** PostgreSQL
- **Echtzeit:** WebSockets / Server-Sent Events
- **Deployment:** Docker + Reverse Proxy (Nginx) + Cloud/VPS

### 4.3 Datenmodell (Kernobjekte)
- **Room** (id, type, number, capacity)
- **Booking** (id, roomId, source, status, checkIn, checkOut, guestsCount)
- **Guest** (id, firstName, lastName, email, phone)
- **AvailabilitySnapshot** (roomId, date, isAvailable)
- **ExternalSyncLog** (provider, externalId, status, lastSyncAt, error)

### 4.4 Geschäftsregeln
- Keine Überlappung bestätigter Buchungen pro Zimmer
- Apartments 301 als zwei getrennte Ressourcen führen (z. B. 301A/301B intern)
- Verfügbarkeitsprüfung vor Buchungsbestätigung immer serverseitig
- Zeitliche Konsistenz bei externem Import (idempotente Upserts)

### 4.5 Sicherheit und Datenschutz
- TLS/HTTPS verpflichtend
- Rollen: Admin / Rezeption / ggf. Leserechte
- DSGVO-konforme Speicherung personenbezogener Daten
- Protokollierung von Buchungsänderungen (Audit Trail)

---

## 5. Umsetzungsplan (Roadmap)

### Phase 1 – MVP
- Zimmer- und Stammdatenverwaltung
- Interner Kalender (Tag/Woche/Monat)
- Manuelle Buchung + Verfügbarkeitsprüfung
- Responsive UI-Grundlayout

### Phase 2 – Online-Buchung
- Buchungsmaske für Homepage
- Echtzeit-Validierung und Soforteintragung
- Bestätigungs-E-Mail

### Phase 3 – Externe Integrationen
- Erste Plattformanbindung (z. B. Booking)
- Synchronisierungsjobs + Webhooks
- Konfliktmanagement und Monitoring

### Phase 4 – Stabilisierung & Skalierung
- Reporting (Auslastung, Umsatz, Aufenthaltsdauer)
- Erweiterte Rechteverwaltung
- Lasttests, Observability, Backups, Notfallprozesse

---

## 6. Zielzustand
Ein zentrales, responsives Buchungssystem mit:
- transparenter Zimmerübersicht
- Echtzeit-Belegungsverwaltung
- direkter Online-Buchung über die Website
- Erweiterbarkeit durch externe API-Anbindungen
