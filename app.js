let rooms = [];
let bookings = [];

const today = new Date();

const els = {
  viewMode: document.querySelector('#viewMode'),
  referenceDate: document.querySelector('#referenceDate'),
  calendarBody: document.querySelector('#calendarBody'),
  calendarMeta: document.querySelector('#calendarMeta'),
  roomId: document.querySelector('#roomId'),
  bookingForm: document.querySelector('#bookingForm'),
  guestName: document.querySelector('#guestName'),
  checkIn: document.querySelector('#checkIn'),
  checkOut: document.querySelector('#checkOut'),
  guests: document.querySelector('#guests'),
  contact: document.querySelector('#contact'),
  details: document.querySelector('#details'),
  formMessage: document.querySelector('#formMessage'),
};

function dateToIso(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

function addDays(isoDate, days) {
  const d = new Date(`${isoDate}T00:00:00`);
  d.setDate(d.getDate() + days);
  return dateToIso(d);
}

function getRange(mode, referenceDate) {
  if (mode === 'day') {
    return { start: referenceDate, end: addDays(referenceDate, 1), label: `Tag: ${referenceDate}` };
  }

  if (mode === 'week') {
    const d = new Date(`${referenceDate}T00:00:00`);
    const weekday = d.getDay() || 7;
    d.setDate(d.getDate() - (weekday - 1));
    const start = dateToIso(d);
    const end = addDays(start, 7);
    return { start, end, label: `Woche: ${start} bis ${addDays(end, -1)}` };
  }

  const [year, month] = referenceDate.split('-').map(Number);
  const start = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = new Date(year, month, 1);
  const end = dateToIso(endDate);
  return { start, end, label: `Monat: ${start.slice(0, 7)}` };
}

function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

function getBookingsForRoom(roomId, range) {
  return bookings.filter(
    (b) => b.roomId === roomId && overlaps(b.checkIn, b.checkOut, range.start, range.end)
  );
}

function renderRoomOptions() {
  els.roomId.innerHTML = '';
  rooms.forEach((room) => {
    const opt = document.createElement('option');
    opt.value = room.id;
    opt.textContent = `${room.label} (${room.capacity} Pers.)`;
    els.roomId.append(opt);
  });
}

function renderCalendar() {
  const range = getRange(els.viewMode.value, els.referenceDate.value);
  els.calendarMeta.textContent = `${range.label} • Live-Daten aus lokaler JSON-Datenbasis`;
  els.calendarBody.innerHTML = '';

  rooms.forEach((room) => {
    const tr = document.createElement('tr');
    const active = getBookingsForRoom(room.id, range);

    tr.innerHTML = `
      <td>${room.label}</td>
      <td>${room.type} • ${room.capacity} Pers.</td>
      <td>
        ${
          active.length
            ? active
                .map(
                  (b) => `
              <div class="booking">
                <strong>${b.guestName}</strong><br/>
                ${b.checkIn} → ${b.checkOut}<br/>
                ${b.guests} Personen<br/>
                <small>${b.details || 'Keine Details'}</small>
              </div>
            `
                )
                .join('')
            : '<span class="muted">Frei im gewählten Zeitraum</span>'
        }
      </td>
    `;

    els.calendarBody.append(tr);
  });
}

function setMessage(text, type) {
  els.formMessage.textContent = text;
  els.formMessage.className = `message ${type}`;
}

async function loadData() {
  const [roomsRes, bookingsRes] = await Promise.all([fetch('/api/rooms'), fetch('/api/bookings')]);
  if (!roomsRes.ok || !bookingsRes.ok) {
    throw new Error('API nicht erreichbar');
  }

  rooms = await roomsRes.json();
  bookings = await bookingsRes.json();
}

async function handleBookingSubmit(event) {
  event.preventDefault();

  const payload = {
    roomId: els.roomId.value,
    guestName: els.guestName.value.trim(),
    checkIn: els.checkIn.value,
    checkOut: els.checkOut.value,
    guests: Number(els.guests.value),
    contact: els.contact.value.trim(),
    details: els.details.value.trim(),
  };

  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const body = await res.json();
    if (!res.ok) {
      setMessage(body.error || 'Buchung konnte nicht gespeichert werden.', 'error');
      return;
    }

    bookings.push(body);
    setMessage('Buchung gespeichert (persistiert in Datenbasis).', 'success');
    els.bookingForm.reset();
    els.roomId.value = rooms[0].id;
    els.guests.value = '2';
    renderCalendar();
  } catch {
    setMessage('Server nicht erreichbar. Bitte Backend starten.', 'error');
  }
}

async function init() {
  const isoToday = dateToIso(today);
  els.referenceDate.value = isoToday;
  els.checkIn.value = isoToday;
  els.checkOut.value = addDays(isoToday, 1);

  els.viewMode.addEventListener('change', renderCalendar);
  els.referenceDate.addEventListener('change', renderCalendar);
  els.bookingForm.addEventListener('submit', handleBookingSubmit);

  try {
    await loadData();
    renderRoomOptions();
    els.roomId.value = rooms[0].id;
    renderCalendar();
  } catch {
    setMessage('Backend/API nicht verfügbar. Starte: node server.js', 'error');
  }
}

init();
