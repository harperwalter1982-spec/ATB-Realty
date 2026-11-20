"use server";

import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { appointments } from "@/lib/db/schema";

const BUSINESS_ID = "atb-owner";
const BUSINESS_TIME_ZONE = "America/Denver";
const APPOINTMENT_TYPES = [
  "buyer_consultation",
  "seller_consultation",
  "property_management",
  "agent_opportunity",
] as const;
const TIME_SLOTS = Array.from({ length: 16 }, (_, index) => {
  const totalMinutes = 9 * 60 + index * 30;
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
});

const appointmentRequestSchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  customerEmail: z.string().trim().email().max(320),
  customerPhone: z
    .string()
    .trim()
    .min(7)
    .max(30)
    .regex(/^[0-9+().\-\s]+$/),
  appointmentType: z.enum(APPOINTMENT_TYPES),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  appointmentTime: z.string().regex(/^(0[9]|1[0-6]):(00|30)$/),
  message: z.string().trim().max(1000),
});

function getMountainNow() {
  const parts = new Map(
    new Intl.DateTimeFormat("en-US", {
      timeZone: BUSINESS_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date())
      .map((part) => [part.type, part.value]),
  );
  const year = parts.get("year") ?? "";
  const month = parts.get("month") ?? "";
  const day = parts.get("day") ?? "";
  const hour = parts.get("hour") ?? "00";
  const minute = parts.get("minute") ?? "00";

  return {
    date: `${year}-${month}-${day}`,
    time: `${hour}:${minute}`,
  };
}

function addCalendarDays(dateValue: string, days: number) {
  const [year, month, day] = dateValue.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days))
    .toISOString()
    .slice(0, 10);
}

function isBookableDate(dateValue: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) return false;

  const parsedDate = new Date(`${dateValue}T12:00:00.000Z`);
  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== dateValue
  ) {
    return false;
  }

  const { date: today } = getMountainNow();
  const weekday = parsedDate.getUTCDay();

  return (
    weekday > 0 &&
    weekday < 6 &&
    dateValue >= today &&
    dateValue <= addCalendarDays(today, 60)
  );
}

function isFutureSlot(dateValue: string, timeValue: string) {
  const { date: today, time: currentTime } = getMountainNow();
  return dateValue > today || (dateValue === today && timeValue > currentTime);
}

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function getAvailableAppointmentSlots(dateValue: string) {
  if (!isBookableDate(dateValue)) {
    return {
      slots: [],
      error: "Choose a weekday within the next 60 days.",
    };
  }

  try {
    const bookedSlots = await db
      .select({ appointmentTime: appointments.appointmentTime })
      .from(appointments)
      .where(
        and(
          eq(appointments.userId, BUSINESS_ID),
          eq(appointments.appointmentDate, dateValue),
          inArray(appointments.status, ["pending", "confirmed"]),
        ),
      );
    const bookedTimes = new Set(
      bookedSlots.map(({ appointmentTime }) => appointmentTime.slice(0, 5)),
    );

    return {
      slots: TIME_SLOTS.filter(
        (timeValue) =>
          !bookedTimes.has(timeValue) && isFutureSlot(dateValue, timeValue),
      ),
      error: null,
    };
  } catch {
    return {
      slots: [],
      error: "Availability is temporarily unavailable. Please call Mike at (719) 422-9702.",
    };
  }
}

export async function submitAppointmentRequest(formData: FormData) {
  if (getFormValue(formData, "website").trim()) {
    return {
      success: true,
      message: "Your request has been received. Mike will be in touch shortly.",
    };
  }

  const parsed = appointmentRequestSchema.safeParse({
    customerName: getFormValue(formData, "customerName"),
    customerEmail: getFormValue(formData, "customerEmail"),
    customerPhone: getFormValue(formData, "customerPhone"),
    appointmentType: getFormValue(formData, "appointmentType"),
    appointmentDate: getFormValue(formData, "appointmentDate"),
    appointmentTime: getFormValue(formData, "appointmentTime"),
    message: getFormValue(formData, "message"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the form and complete all required fields.",
    };
  }

  const request = parsed.data;
  if (
    !isBookableDate(request.appointmentDate) ||
    !TIME_SLOTS.includes(request.appointmentTime) ||
    !isFutureSlot(request.appointmentDate, request.appointmentTime)
  ) {
    return {
      success: false,
      message: "That time is no longer available. Choose another weekday and time.",
      code: "slot_taken",
    };
  }

  try {
    const [savedAppointment] = await db
      .insert(appointments)
      .values({
        userId: BUSINESS_ID,
        customerName: request.customerName,
        customerEmail: request.customerEmail,
        customerPhone: request.customerPhone,
        appointmentType: request.appointmentType,
        appointmentDate: request.appointmentDate,
        appointmentTime: request.appointmentTime,
        message: request.message,
      })
      .onConflictDoNothing()
      .returning({ id: appointments.id });

    if (!savedAppointment) {
      return {
        success: false,
        message: "That time was just requested by someone else. Please choose another.",
        code: "slot_taken",
      };
    }

    return {
      success: true,
      message: "Your request is in. Mike will confirm the time by phone or email.",
    };
  } catch {
    return {
      success: false,
      message: "We couldn't save your request. Please call Mike at (719) 422-9702.",
    };
  }
}
