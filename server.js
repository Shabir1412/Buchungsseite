const http = require('http');
const fs = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');

const PORT = process.env.PORT || 4173;
const ROOT = __dirname;
const DATA_FILE = path.join(ROOT, 'data', 'bookings.json');

const rooms = [
  ...[101, 102, 103, 104, 105, 201, 202, 203, 204, 205].map((n) => ({
    id: String(n),
    label: `Zimmer ${n}`,
    type: 'Standard',
    capacity: 2,
  })),
  { id: '301A', label: 'Apartment 301A', type: 'Apartment', capacity: 4 },
  { id: '301B', label: 'Apartment 301B', type: 'Apartment', capacity: 4 },
  { id: '11', label: 'Familienzimmer 11', type: 'Familienzimmer', capacity: 4 },
];

function json(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

async function readBookings() {
  const raw = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

async function writeBookings(bookings) {
  await fs.writeFile(DATA_FILE, JSON.stringify(bookings, null, 2));
}

function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

async function parseBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8') || '{}';
  return JSON.parse(raw);
}

function contentType(filePath) {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  if (filePath.endsWith('.js')) return 'application/javascript; charset=utf-8';
  if (filePath.endsWith('.json')) return 'application/json; charset=utf-8';
  return 'text/plain; charset=utf-8';
}

async function handleApi(req, res) {
  if (req.method === 'GET' && req.url === '/api/rooms') {
    return json(res, 200, rooms);
  }

  if (req.method === 'GET' && req.url === '/api/bookings') {
    const bookings = await readBookings();
    return json(res, 200, bookings);
  }

  if (req.method === 'POST' && req.url === '/api/bookings') {
    const payload = await parseBody(req);
    const { roomId, guestName, checkIn, checkOut, guests, contact = '', details = '' } = payload;
    const room = rooms.find((r) => r.id === roomId);

    if (!room || !guestName || !checkIn || !checkOut || !(Number(guests) > 0) || checkIn >= checkOut) {
      return json(res, 400, { error: 'Ungültige Buchungsdaten.' });
    }

    if (Number(guests) > room.capacity) {
      return json(res, 400, { error: `Maximale Kapazität: ${room.capacity} Personen.` });
    }

    const bookings = await readBookings();
    const conflict = bookings.some(
      (b) => b.roomId === roomId && overlaps(b.checkIn, b.checkOut, checkIn, checkOut)
    );

    if (conflict) {
      return json(res, 409, { error: 'Zimmer im Zeitraum bereits gebucht.' });
    }

    const newBooking = {
      id: randomUUID(),
      roomId,
      guestName: String(guestName).trim(),
      checkIn,
      checkOut,
      guests: Number(guests),
      contact: String(contact).trim(),
      details: String(details).trim(),
    };

    bookings.push(newBooking);
    await writeBookings(bookings);
    return json(res, 201, newBooking);
  }

  return json(res, 404, { error: 'API-Endpunkt nicht gefunden.' });
}

async function handleStatic(req, res) {
  const safeUrl = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.join(ROOT, safeUrl);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  try {
    const data = await fs.readFile(filePath);
    res.writeHead(200, { 'Content-Type': contentType(filePath) });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}

const server = http.createServer(async (req, res) => {
  try {
    if ((req.url || '').startsWith('/api/')) {
      return await handleApi(req, res);
    }
    return await handleStatic(req, res);
  } catch (error) {
    return json(res, 500, { error: 'Serverfehler', detail: String(error.message || error) });
  }
});

server.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
