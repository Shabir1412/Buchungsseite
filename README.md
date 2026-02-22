# Online-Buchungssystem für ein kleines Hotel

## 1. Projektziel
Dieses Repository beschreibt ein webbasiertes Buchungssystem zur zentralen Verwaltung und Online-Buchung von Hotelzimmern mit Echtzeit-Synchronisation.

## 2. Zimmerstruktur
- **Standardzimmer:** 101–105, 201–205
- **Apartments:** 2 Einheiten mit Nummer 301
- **Familienzimmer (Vierbett):** 11

## 3. Fachliche Kernfunktionen

### 3.1 Zentrale Kalenderansicht
- Tages-, Wochen- und Monatsansicht
- Zimmerweise Darstellung der Belegung
- Kennzeichnung der Personenkapazität je Zimmer
- Anzeige pro Buchung:
  - Name des Gastes
  - Aufenthaltszeitraum
  - Anzahl der Personen
  - Buchungsdetails

### 3.2 Buchungsmaske (Website-Integration)
- Einbettung in die bestehende Hotel-Homepage
- Direkte Online-Buchung durch Gäste
- Erfassung von:
  - Aufenthaltszeitraum
  - Personenanzahl
  - Kontaktdaten
- Automatische Eintragung in das System in Echtzeit

### 3.3 Plattformunabhängigkeit
- Vollständig webbasiert
- Optimiert für Desktop, Tablet und Smartphone

## 4. Schnittstellen und Synchronisierung
- API-Anbindung an externe Buchungsplattformen (z. B. Booking)
- API-Anbindung an die eigene Hotel-Homepage
- Echtzeit-Synchronisierung zur Vermeidung von Doppelbuchungen

## 5. Zielzustand
Ein zentrales, responsives Buchungssystem mit:
- transparenter Zimmerübersicht
- Echtzeit-Belegungsverwaltung
- direkter Online-Buchung über die Website
- Erweiterbarkeit durch externe API-Anbindungen

## 6. Technische Spezifikation (Vorschlag)

### 6.1 Architektur
- **Frontend:** Responsive Web-App mit Kalender-UI und Buchungsformular
- **Backend:** REST-API für Buchungen, Verfügbarkeiten, Zimmerstammdaten
- **Datenbank:** Relationale Datenbank mit Transaktionen für Buchungskonsistenz
- **Sync-Service:** Job-/Event-basierte Synchronisierung externer Plattformen

### 6.2 Empfohlener Technologie-Stack
- **Frontend:** React + TypeScript + UI-Bibliothek (z. B. MUI)
- **Backend:** Node.js (NestJS/Express) oder Python (FastAPI)
- **Datenbank:** PostgreSQL
- **Echtzeit:** WebSockets oder Server-Sent Events für Live-Updates
- **Deployment:** Docker + Reverse Proxy (z. B. Nginx)

### 6.3 Datenmodell (Minimal)
- `rooms`: Zimmernummer, Typ, Kapazität, Aktiv-Status
- `bookings`: Zimmer, Gastdaten, Zeitraum, Personenanzahl, Status, Quelle
- `availability_locks`: temporäre Sperren während Buchungsvorgang
- `sync_events`: Import-/Export-Ereignisse und Fehlerstatus

### 6.4 Vermeidung von Doppelbuchungen
- Buchungsprüfung und Speicherung in einer DB-Transaktion
- Exklusive Sperre pro Zimmer + Zeitraum
- Idempotente Verarbeitung externer API-Events

### 6.5 Umsetzungsplan (MVP -> Ausbau)
1. Datenmodell und interne Buchungs-API
2. Kalenderansicht (Monat/Woche/Tag) mit Zimmerzeilen
3. Buchungsformular und Validierung
4. Echtzeit-Updates im Frontend
5. Externe API-Schnittstellen (zunächst ein Provider)
6. Monitoring, Protokollierung und Rollenrechte
