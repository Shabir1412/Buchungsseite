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

const bookings = [
  {
    id: crypto.randomUUID(),
    roomId: '101',
    guestName: 'Anna Becker',
    checkIn: '2026-03-01',
    checkOut: '2026-03-04',
    guests: 2,
    details: 'Direktbuchung Website',
    contact: 'anna@example.com',
  },
  {
    id: crypto.randomUUID(),
    roomId: '301A',
    guestName: 'Familie Yilmaz',
    checkIn: '2026-03-02',
    checkOut: '2026-03-08',
    guests: 4,
    details: 'Booking API',
    contact: '+49 170 123456',
  },
];

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
  rooms.forEach((room) => {
    const opt = document.createElement('option');
    opt.value = room.id;
    opt.textContent = `${room.label} (${room.capacity} Pers.)`;
    els.roomId.append(opt);
  });
}

function renderCalendar() {
  const range = getRange(els.viewMode.value, els.referenceDate.value);
  els.calendarMeta.textContent = `${range.label} • Echtzeit-Sync simuliert (lokaler State)`;
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

function handleBookingSubmit(event) {
  event.preventDefault();
  const room = rooms.find((r) => r.id === els.roomId.value);
  const checkIn = els.checkIn.value;
  const checkOut = els.checkOut.value;
  const guests = Number(els.guests.value);

  if (!room || !checkIn || !checkOut || checkIn >= checkOut) {
    setMessage('Bitte gültige An- und Abreise angeben.', 'error');
    return;
  }

  if (guests > room.capacity) {
    setMessage(`Maximale Kapazität für ${room.label}: ${room.capacity} Personen.`, 'error');
    return;
  }

  const conflict = bookings.some(
    (b) => b.roomId === room.id && overlaps(b.checkIn, b.checkOut, checkIn, checkOut)
  );

  if (conflict) {
    setMessage('Für dieses Zimmer gibt es in dem Zeitraum bereits eine Buchung.', 'error');
    return;
  }

  bookings.push({
    id: crypto.randomUUID(),
    roomId: room.id,
    guestName: els.guestName.value.trim(),
    checkIn,
    checkOut,
    guests,
    contact: els.contact.value.trim(),
    details: els.details.value.trim(),
  });

  setMessage('Buchung erfolgreich gespeichert und Kalender in Echtzeit aktualisiert.', 'success');
  els.bookingForm.reset();
  els.roomId.value = rooms[0].id;
  els.guests.value = '2';
  renderCalendar();
}

function init() {
  const isoToday = dateToIso(today);
  els.referenceDate.value = isoToday;
  els.checkIn.value = isoToday;
  els.checkOut.value = addDays(isoToday, 1);

  renderRoomOptions();
  els.roomId.value = rooms[0].id;

  els.viewMode.addEventListener('change', renderCalendar);
  els.referenceDate.addEventListener('change', renderCalendar);
  els.bookingForm.addEventListener('submit', handleBookingSubmit);

  renderCalendar();
}

init();
