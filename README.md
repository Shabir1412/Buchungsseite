# Online-Buchungssystem – MVP

Dieses Repository enthält jetzt einen **lauffähigen Web-Prototyp** für dein Hotel-Buchungssystem.

## Enthaltene Funktionen
- Zimmerstruktur gemäß Vorgabe:
  - Standardzimmer: 101–105, 201–205
  - Apartments: 301A und 301B (intern getrennt, damit keine Doppelbuchung)
  - Familienzimmer: 11
- Kalenderansicht mit Modi:
  - Tag
  - Woche
  - Monat
- Zimmerweise Belegungsanzeige mit:
  - Gastname
  - Aufenthaltszeitraum
  - Personenanzahl
  - Buchungsdetails
- Online-Buchungsformular mit:
  - Zeitraum
  - Personen
  - Kontaktdaten
  - Details
- Sofortige Aktualisierung der Kalenderansicht nach erfolgreicher Buchung
- Konfliktprüfung gegen Doppelbuchungen
- Responsive Darstellung für Desktop/Tablet/Smartphone

## Projektstruktur
- `index.html` – Oberfläche (Kalender + Buchungsmaske)
- `styles.css` – responsives Styling
- `app.js` – Datenmodell, Verfügbarkeitsprüfung, Render-Logik

## Lokal starten
Da es eine statische Web-App ist, reicht ein einfacher HTTP-Server:

```bash
python3 -m http.server 4173
```

Dann im Browser öffnen:

```text
http://localhost:4173
```

## Nächste Ausbaustufen (optional)
- Persistenz über Backend + Datenbank (statt In-Memory)
- API-Adapter für Booking & Homepage
- Auth/Rollen für Rezeption/Admin
- Echte Echtzeit-Synchronisierung per WebSocket/Webhooks
