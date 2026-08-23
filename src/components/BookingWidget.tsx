"use client";

import { useEffect, useState } from "react";
import "./booking-widget.css";
import { formatFullDate, formatTimeLabel } from "@/lib/booking/slots";

interface DaySlots {
  date: string;
  slots: string[];
}

export interface BookingWidgetPrefill {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  businessName?: string;
}

interface BookingWidgetProps {
  lang: "en" | "es";
  prefill?: BookingWidgetPrefill;
}

function formatDateChip(dateStr: string, lang: "en" | "es") {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12));
  const dow = dt.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", { timeZone: "UTC", weekday: "short" });
  return { dow: dow.replace(".", ""), dnum: d };
}

export default function BookingWidget({ lang, prefill }: BookingWidgetProps) {
  const [days, setDays] = useState<DaySlots[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [firstName, setFirstName] = useState(prefill?.firstName || "");
  const [lastName, setLastName] = useState(prefill?.lastName || "");
  const [phone, setPhone] = useState(prefill?.phone || "");
  const [email, setEmail] = useState(prefill?.email || "");
  const businessName = prefill?.businessName || "";

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{ date: string; time: string } | null>(null);

  const t =
    lang === "es"
      ? {
          dateLabel: "Elija una fecha",
          timeLabel: "Elija una hora (Hora de Montaña)",
          detailsLabel: "Sus datos",
          firstName: "Nombre",
          lastName: "Apellido",
          phone: "Número de teléfono",
          email: "Correo electrónico",
          btn: "Confirmar Reserva",
          sending: "Reservando...",
          note: "Le llamaremos a la hora programada. Puede responder al correo de confirmación si necesita reprogramar.",
          missing: "Por favor complete su nombre, apellido, teléfono y correo.",
          loadErr: "No se pudieron cargar los horarios disponibles. Actualice la página.",
          noSlots: "No hay horarios disponibles en este momento. Por favor contáctenos directamente.",
          confirmedH: "¡Reserva Confirmada!",
          confirmedP: "Le enviamos los detalles a su correo. Nos vemos pronto.",
          confirmedSpamNote: "Si no ve el correo de confirmación en unos minutos, revise su carpeta de spam o correo no deseado.",
        }
      : {
          dateLabel: "Choose a date",
          timeLabel: "Choose a time (Mountain Time)",
          detailsLabel: "Your details",
          firstName: "First name",
          lastName: "Last name",
          phone: "Phone number",
          email: "Email address",
          btn: "Confirm Booking",
          sending: "Booking...",
          note: "We'll call you at the scheduled time. Reply to the confirmation email if you need to reschedule.",
          missing: "Please fill in your first name, last name, phone, and email.",
          loadErr: "Could not load available times. Please refresh the page.",
          noSlots: "No times are currently available. Please contact us directly.",
          confirmedH: "Booking Confirmed!",
          confirmedP: "We've sent the details to your email. Talk soon.",
          confirmedSpamNote: "Don't see the confirmation email in a few minutes? Check your spam or junk folder.",
        };

  async function loadAvailability() {
    setLoadError(false);
    try {
      const res = await fetch("/api/booking/availability");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDays(data.days || []);
    } catch {
      setLoadError(true);
    }
  }

  useEffect(() => {
    loadAvailability();
  }, []);

  const selectedDay = days?.find((d) => d.date === selectedDate) || null;

  async function submit() {
    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !email.trim() || !selectedDate || !selectedTime) {
      setError(t.missing);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          email,
          businessName,
          date: selectedDate,
          time: selectedTime,
          lang,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t.loadErr);
        setSelectedTime(null);
        loadAvailability();
        return;
      }
      setConfirmed({ date: selectedDate, time: selectedTime });
    } catch {
      setError(t.loadErr);
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmed) {
    return (
      <div className="booking-widget">
        <div className="book-confirm">
          <div className="icon">✓</div>
          <h2>{t.confirmedH}</h2>
          <div className="confirm-datetime">
            {formatFullDate(confirmed.date, lang)} · {formatTimeLabel(confirmed.time)}
          </div>
          <p>{t.confirmedP}</p>
          <p className="book-note">{t.confirmedSpamNote}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-widget">
      <div className="book-card">
        <div className="book-card-label">{t.dateLabel}</div>
        {loadError && <p className="book-error">{t.loadErr}</p>}
        {!loadError && days === null && <p className="book-note">...</p>}
        {!loadError && days !== null && days.length === 0 && <p className="book-note">{t.noSlots}</p>}
        {!loadError && days !== null && days.length > 0 && (
          <div className="date-grid">
            {days.map((day) => {
              const { dow, dnum } = formatDateChip(day.date, lang);
              return (
                <div
                  key={day.date}
                  className={`date-chip ${selectedDate === day.date ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedDate(day.date);
                    setSelectedTime(null);
                  }}
                >
                  <div className="dow">{dow}</div>
                  <div className="dnum">{dnum}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedDay && (
        <div className="book-card">
          <div className="book-card-label">{t.timeLabel}</div>
          <div className="slot-grid">
            {selectedDay.slots.map((slot) => (
              <div
                key={slot}
                className={`slot-chip ${selectedTime === slot ? "selected" : ""}`}
                onClick={() => setSelectedTime(slot)}
              >
                {formatTimeLabel(slot)}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTime && (
        <div className="book-card">
          <div className="book-card-label">{t.detailsLabel}</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t.firstName}</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">{t.lastName}</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t.phone}</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">{t.email}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <button className="btn-book" onClick={submit} disabled={submitting}>
            {submitting ? t.sending : t.btn}
          </button>
          {error && <p className="book-error">{error}</p>}
          <p className="book-note">{t.note}</p>
        </div>
      )}
    </div>
  );
}
