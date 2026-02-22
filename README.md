# Online-Buchungssystem – Live MVP (Frontend + Datenbasis)

Dieses Projekt ist jetzt ein **lauffähiges Mini-System mit Frontend und persistenter Datenbasis**.

## Was ist jetzt neu?
- Live-Frontend bleibt wie gehabt (Kalender + Buchungsformular).
- Zusätzlich gibt es ein kleines Backend (`server.js`) mit API-Endpunkten.
- Buchungen werden in `data/bookings.json` gespeichert und bleiben nach Neustart erhalten.

## Dateien
- `index.html` – UI
- `styles.css` – responsives Design
- `app.js` – Frontend-Logik, API-Aufrufe
- `server.js` – Node.js HTTP-Server + API + statische Dateien
- `data/bookings.json` – persistente Buchungsdaten

## Starten (wichtig)
Nicht mehr `python3 -m http.server`, sondern:

```bash
node server.js
```

Dann öffnen:

```text
http://localhost:4173
```

## API (lokal)
- `GET /api/rooms` → Zimmerliste
- `GET /api/bookings` → bestehende Buchungen
- `POST /api/bookings` → neue Buchung (mit Validierung, Konfliktprüfung)

## Hinweis
Das ist weiterhin ein MVP, aber jetzt mit echter Datenbasis-Datei. Nächster Schritt wäre Datenbank (z. B. PostgreSQL) + echte externe API-Synchronisierung.
