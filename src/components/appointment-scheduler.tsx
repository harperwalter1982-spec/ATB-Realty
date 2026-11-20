"use client";

import { useRef, useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import {
  getAvailableAppointmentSlots,
  submitAppointmentRequest,
} from "@/app/appointment-actions";

type Availability = Awaited<ReturnType<typeof getAvailableAppointmentSlots>>;
type BookingFeedback = Awaited<ReturnType<typeof submitAppointmentRequest>>;

const appointmentTypes = [
  { value: "buyer_consultation", label: "Buying a home" },
  { value: "seller_consultation", label: "Selling a property" },
  { value: "property_management", label: "Property management" },
  { value: "agent_opportunity", label: "Agent opportunities" },
];

function getMountainDate(date = new Date()) {
  const parts = new Map(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Denver",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value]),
  );

  return `${parts.get("year")}-${parts.get("month")}-${parts.get("day")}`;
}

function addDays(dateValue: string, days: number) {
  const [year, month, day] = dateValue.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days))
    .toISOString()
    .slice(0, 10);
}

function formatTime(timeValue: string) {
  const [hour, minute] = timeValue.split(":").map(Number);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute.toString().padStart(2, "0")} ${suffix}`;
}

export function AppointmentScheduler() {
  const [date, setDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availability, setAvailability] = useState<Availability>({
    slots: [],
    error: null,
  });
  const [feedback, setFeedback] = useState<BookingFeedback | null>(null);
  const [isLoadingSlots, startLoadingSlots] = useTransition();
  const [isSubmitting, startSubmitting] = useTransition();
  const [dateBounds, setDateBounds] = useState<{
    minimum: string;
    maximum: string;
  } | null>(null);
  const availabilityRequestId = useRef(0);

  function handleDateChange(event: ChangeEvent<HTMLInputElement>) {
    const nextDate = event.currentTarget.value;
    const requestId = ++availabilityRequestId.current;

    setDate(nextDate);
    setSelectedTime("");
    setFeedback(null);
    setAvailability({ slots: [], error: null });

    if (!nextDate) return;

    startLoadingSlots(async () => {
      const nextAvailability = await getAvailableAppointmentSlots(nextDate);
      if (requestId === availabilityRequestId.current) {
        setAvailability(nextAvailability);
      }
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    const form = event.currentTarget;

    startSubmitting(async () => {
      const result = await submitAppointmentRequest(new FormData(form));
      setFeedback(result);

      if (result.success) {
        form.reset();
        setDate("");
        setSelectedTime("");
        setAvailability({ slots: [], error: null });
        availabilityRequestId.current += 1;
        return;
      }

      if (result.code === "slot_taken" && date) {
        const requestId = ++availabilityRequestId.current;
        const nextAvailability = await getAvailableAppointmentSlots(date);
        if (requestId === availabilityRequestId.current) {
          setAvailability(nextAvailability);
          setSelectedTime("");
        }
      }
    });
  }

  return (
    <section className="schedule-section section-pad" id="schedule" aria-labelledby="schedule-title">
      <div className="schedule-layout page-shell">
        <div className="schedule-copy">
          <p className="eyebrow eyebrow-light">Make time for what&apos;s next</p>
          <h2 id="schedule-title">
            Let&apos;s talk about
            <br />
            <em>your next move.</em>
          </h2>
          <p>
            Choose a time for a one-on-one conversation about buying, selling,
            property management, or joining our team.
          </p>
          <ul className="schedule-facts">
            <li>Weekdays, 9:00 AM–4:30 PM</li>
            <li>30-minute conversations</li>
            <li>Colorado time</li>
          </ul>
          <p className="schedule-confirmation-note">
            Send a request online and Mike will confirm your appointment by
            phone or email. Your late-night listing tabs are judgment-free here.
          </p>
        </div>

        <div className="scheduler-card">
          <div className="scheduler-card-heading">
            <div>
              <p className="eyebrow eyebrow-dark">Around the Block Realty</p>
              <h3>Choose a time</h3>
            </div>
            <span className="scheduler-duration">30 min</span>
          </div>

          <form className="scheduler-form" onSubmit={handleSubmit}>
            <input
              className="scheduler-trap"
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div className="scheduler-fields">
              <label className="scheduler-field" htmlFor="appointment-type">
                <span>What would you like to discuss?</span>
                <select id="appointment-type" name="appointmentType" required defaultValue="">
                  <option value="" disabled>
                    Select a topic
                  </option>
                  {appointmentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="scheduler-field" htmlFor="appointment-date">
                <span>Choose a weekday</span>
                <input
                  id="appointment-date"
                  type="date"
                  name="appointmentDate"
                  min={dateBounds?.minimum}
                  max={dateBounds?.maximum}
                  value={date}
                  onFocus={() => {
                    if (!dateBounds) {
                      const minimum = getMountainDate();
                      setDateBounds({ minimum, maximum: addDays(minimum, 60) });
                    }
                  }}
                  onChange={handleDateChange}
                  required
                />
              </label>
            </div>

            <fieldset className="scheduler-slots" aria-busy={isLoadingSlots}>
              <legend>
                Available times <span>Mountain Time</span>
              </legend>
              {isLoadingSlots ? (
                <p className="scheduler-hint" role="status">
                  Checking availability…
                </p>
              ) : availability.error ? (
                <p className="scheduler-hint scheduler-hint-error" role="status">
                  {availability.error}
                </p>
              ) : availability.slots.length > 0 ? (
                <div className="scheduler-time-grid">
                  {availability.slots.map((slot, index) => (
                    <label className="scheduler-time-option" key={slot}>
                      <input
                        type="radio"
                        name="appointmentTime"
                        value={slot}
                        checked={selectedTime === slot}
                        onChange={() => setSelectedTime(slot)}
                        required={index === 0}
                      />
                      <span>{formatTime(slot)}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="scheduler-hint">
                  {date
                    ? "No times are open that day. Choose another weekday."
                    : "Select a weekday to see open times."}
                </p>
              )}
            </fieldset>

            <div className="scheduler-fields">
              <label className="scheduler-field" htmlFor="customer-name">
                <span>Your name</span>
                <input
                  id="customer-name"
                  type="text"
                  name="customerName"
                  autoComplete="name"
                  maxLength={100}
                  required
                />
              </label>
              <label className="scheduler-field" htmlFor="customer-phone">
                <span>Phone number</span>
                <input
                  id="customer-phone"
                  type="tel"
                  name="customerPhone"
                  autoComplete="tel"
                  maxLength={30}
                  required
                />
              </label>
              <label className="scheduler-field scheduler-field-full" htmlFor="customer-email">
                <span>Email address</span>
                <input
                  id="customer-email"
                  type="email"
                  name="customerEmail"
                  autoComplete="email"
                  maxLength={320}
                  required
                />
              </label>
              <label className="scheduler-field scheduler-field-full" htmlFor="appointment-message">
                <span>Anything you&apos;d like Mike to know? <small>Optional</small></span>
                <textarea
                  id="appointment-message"
                  name="message"
                  rows={3}
                  maxLength={1000}
                />
              </label>
            </div>

            {feedback && (
              <p
                className="scheduler-feedback"
                data-status={feedback.success ? "success" : "error"}
                role={feedback.success ? "status" : "alert"}
              >
                {feedback.message}
              </p>
            )}

            <p className="scheduler-privacy" id="scheduler-privacy">
              Your details are used only to arrange this conversation.
            </p>
            <button
              className="button button-light scheduler-submit"
              type="submit"
              disabled={isSubmitting || isLoadingSlots || !selectedTime}
              aria-describedby="scheduler-privacy"
            >
              {isSubmitting ? "Sending request…" : "Request this time"}
              <span aria-hidden="true">↗</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
