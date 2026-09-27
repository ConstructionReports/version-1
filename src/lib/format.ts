import type { Employee } from "../types";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

const shortDateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export function formatDate(iso: string): string {
  if (!iso) return "—";
  return dateFmt.format(parseIsoDate(iso));
}

export function formatShortDate(iso: string): string {
  if (!iso) return "—";
  return shortDateFmt.format(parseIsoDate(iso));
}

export function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function nowTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export function crewHours(crew: { count: number; hours: number }[]): number {
  return crew.reduce((sum, row) => sum + row.count * row.hours, 0);
}

export function crewHeads(crew: { count: number }[]): number {
  return crew.reduce((sum, row) => sum + row.count, 0);
}

export function employeeName(employee?: Employee): string {
  if (!employee) return "Unassigned";
  return `${employee.firstName} ${employee.lastName}`.trim();
}

export function newId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now().toString(36)}-${rand}`;
}

export function emptyRowId(): string {
  return newId("row");
}

function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}
