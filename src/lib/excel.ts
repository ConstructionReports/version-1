import * as XLSX from "xlsx";
import { emptySignature, emptyWeather } from "./defaults";
import { newId } from "./format";
import type { Employee, Job, JobTracker, Store } from "../types";

export const TRACKER_COLUMNS = [
  "job_number",
  "job_name",
  "log_date",
  "arrival_at",
  "departure_at",
  "prepared_by_name",
  "prepared_by_role",
  "weather_condition",
  "temp_high_f",
  "temp_low_f",
  "wind",
  "precipitation",
  "weather_notes",
  "weather_delay",
  "weather_hours_lost",
  "work_completed",
  "work_planned_tomorrow",
  "job_description",
  "site_condition",
  "toolbox_topic",
  "incidents",
  "incident_notes",
  "near_miss_notes",
  "safety_notes",
  "ppe_verified",
  "delay",
  "delay_type",
  "delay_hours",
  "delay_notes",
  "assigned_employee_numbers",
  "status",
  "signer_name",
  "signer_role",
  "signed_at",
] as const;

export const JOB_COLUMNS = [
  "job_name",
  "job_number",
  "street_address",
  "city",
  "state",
  "postal_code",
  "client_name",
  "status",
  "timezone",
  "start_date",
  "end_date",
  "superintendent_number",
  "safety_contact_number",
  "job_phone",
  "job_type",
  "description",
  "assigned_employee_numbers",
] as const;

export const EMPLOYEE_COLUMNS = [
  "employee_id",
  "first_name",
  "last_name",
  "phone",
  "email",
  "role",
  "trade",
  "hire_date",
  "status",
  "assignable",
  "emergency_contact_name",
  "emergency_contact_relationship",
  "emergency_contact_phone",
  "notes",
] as const;

type Row = Record<string, string>;

function yn(value: boolean): string {
  return value ? "Y" : "N";
}

function parseYn(value: string | undefined): boolean {
  return String(value ?? "").trim().toUpperCase() === "Y";
}

function cell(value: unknown): string {
  if (value === undefined || value === null) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).trim();
}

function employeeByNumber(employees: Employee[], number: string): Employee | undefined {
  return employees.find((employee) => employee.employeeNumber === number);
}

function numbersFor(ids: string[], employees: Employee[]): string {
  return ids
    .map((id) => employees.find((employee) => employee.id === id)?.employeeNumber)
    .filter(Boolean)
    .join(", ");
}

function idsFromNumbers(value: string, employees: Employee[]): string[] {
  return value
    .split(/[,;]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((number) => employeeByNumber(employees, number)?.id)
    .filter((id): id is string => Boolean(id));
}

export function storeToSheets(store: Store): Record<string, Row[]> {
  const jobs = store.jobs.map((job) => ({
    job_name: job.name,
    job_number: job.number,
    street_address: job.address,
    city: job.city,
    state: job.state,
    postal_code: job.postalCode,
    client_name: job.client,
    status: job.status,
    timezone: job.timezone,
    start_date: job.startDate,
    end_date: job.endDate,
    superintendent_number: store.employees.find((employee) => employee.id === job.superintendentId)?.employeeNumber ?? "",
    safety_contact_number: store.employees.find((employee) => employee.id === job.safetyContactId)?.employeeNumber ?? "",
    job_phone: job.phone,
    job_type: job.jobType,
    description: job.description,
    assigned_employee_numbers: numbersFor(job.assignedEmployeeIds, store.employees),
  }));

  const employees = store.employees.map((employee) => ({
    employee_id: employee.employeeNumber,
    first_name: employee.firstName,
    last_name: employee.lastName,
    phone: employee.phone,
    email: employee.email,
    role: employee.role,
    trade: employee.trade,
    hire_date: employee.hireDate,
    status: employee.status,
    assignable: yn(employee.assignable),
    emergency_contact_name: employee.emergencyContactName,
    emergency_contact_relationship: employee.emergencyContactRelationship,
    emergency_contact_phone: employee.emergencyContactPhone,
    notes: employee.notes,
  }));

  const trackers = store.trackers.map((tracker) => {
    const job = store.jobs.find((item) => item.id === tracker.jobId);
    return {
      job_number: job?.number ?? "",
      job_name: job?.name ?? "",
      log_date: tracker.date,
      arrival_at: tracker.arrivalAt,
      departure_at: tracker.departureAt,
      prepared_by_name: tracker.preparedByName,
      prepared_by_role: tracker.preparedByRole,
      weather_condition: tracker.weather.condition,
      temp_high_f: String(tracker.weather.highF),
      temp_low_f: String(tracker.weather.lowF),
      wind: tracker.weather.wind,
      precipitation: tracker.weather.precipitation,
      weather_notes: tracker.weather.notes,
      weather_delay: yn(tracker.weather.delay),
      weather_hours_lost: String(tracker.weather.hoursLost),
      work_completed: tracker.workCompleted,
      work_planned_tomorrow: tracker.workPlanned,
      job_description: tracker.jobDescription,
      site_condition: tracker.siteCondition,
      toolbox_topic: tracker.toolboxTopic,
      incidents: yn(tracker.incidents),
      incident_notes: tracker.incidentNotes,
      near_miss_notes: tracker.nearMissNotes,
      safety_notes: tracker.safetyNotes,
      ppe_verified: yn(tracker.ppeVerified),
      delay: yn(tracker.delay),
      delay_type: tracker.delayType,
      delay_hours: String(tracker.delayHours),
      delay_notes: tracker.delayNotes,
      assigned_employee_numbers: numbersFor(tracker.assignedEmployeeIds, store.employees),
      status: tracker.status,
      signer_name: tracker.signature.signerName,
      signer_role: tracker.signature.signerRole,
      signed_at: tracker.signature.signedAt,
    };
  });

  const crew = store.trackers.flatMap((tracker) => {
    const job = store.jobs.find((item) => item.id === tracker.jobId);
    return tracker.crew.map((row) => ({
      job_number: job?.number ?? "",
      log_date: tracker.date,
      employee_id: store.employees.find((employee) => employee.id === row.employeeId)?.employeeNumber ?? "",
      company: row.company,
      trade: row.trade,
      worker_count: String(row.count),
      hours: String(row.hours),
      area_or_task: row.areaOrTask,
      notes: row.notes,
    }));
  });

  return { jobs, employees, daily_logs: trackers, crew };
}

export function workbookFromStore(store: Store): XLSX.WorkBook {
  const sheets = storeToSheets(store);
  const book = XLSX.utils.book_new();
  for (const [name, rows] of Object.entries(sheets)) {
    const sheet = XLSX.utils.json_to_sheet(rows.length ? rows : [{}]);
    XLSX.utils.book_append_sheet(book, sheet, name);
  }
  return book;
}

export function downloadWorkbook(store: Store, fileName: string): void {
  const book = workbookFromStore(store);
  XLSX.writeFile(book, fileName);
}

export function downloadTemplate(): void {
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, XLSX.utils.json_to_sheet([Object.fromEntries(JOB_COLUMNS.map((key) => [key, ""]))]), "jobs");
  XLSX.utils.book_append_sheet(
    book,
    XLSX.utils.json_to_sheet([Object.fromEntries(EMPLOYEE_COLUMNS.map((key) => [key, ""]))]),
    "employees",
  );
  XLSX.utils.book_append_sheet(
    book,
    XLSX.utils.json_to_sheet([Object.fromEntries(TRACKER_COLUMNS.map((key) => [key, ""]))]),
    "daily_logs",
  );
  XLSX.writeFile(book, "construction-reports-template.xlsx");
}

function sheetRows(book: XLSX.WorkBook, name: string): Row[] {
  const sheet = book.Sheets[name];
  if (!sheet) return [];
  return XLSX.utils.sheet_to_json<Row>(sheet, { defval: "", raw: false }).map((row) => {
    const next: Row = {};
    for (const [key, value] of Object.entries(row)) {
      next[key.trim().toLowerCase().replace(/\s+/g, "_")] = cell(value);
    }
    return next;
  });
}

export type ImportResult = {
  employees: Employee[];
  jobs: Job[];
  trackers: JobTracker[];
  errors: string[];
  created: number;
  updated: number;
};

export function parseWorkbook(data: ArrayBuffer, current: Store): ImportResult {
  const book = XLSX.read(data, { type: "array" });
  const errors: string[] = [];
  const employees = [...current.employees];
  const jobs = [...current.jobs];
  const trackers = [...current.trackers];
  let created = 0;
  let updated = 0;

  sheetRows(book, "employees").forEach((row, index) => {
    const number = row.employee_id;
    if (!number || !row.first_name) {
      if (Object.values(row).some(Boolean)) errors.push(`employees row ${index + 2}: employee_id and first_name required`);
      return;
    }
    const existing = employees.find((employee) => employee.employeeNumber === number);
    const next: Employee = {
      id: existing?.id ?? newId("emp"),
      employeeNumber: number,
      firstName: row.first_name,
      lastName: row.last_name ?? "",
      phone: row.phone ?? "",
      email: row.email ?? "",
      role: row.role ?? "",
      trade: row.trade ?? "",
      hireDate: row.hire_date ?? "",
      status: row.status === "inactive" ? "inactive" : "active",
      assignable: row.assignable ? parseYn(row.assignable) : true,
      emergencyContactName: row.emergency_contact_name ?? "",
      emergencyContactRelationship: row.emergency_contact_relationship ?? "",
      emergencyContactPhone: row.emergency_contact_phone ?? "",
      certifications: existing?.certifications ?? [],
      notes: row.notes ?? "",
    };
    if (existing) {
      const at = employees.findIndex((employee) => employee.id === existing.id);
      employees[at] = next;
      updated += 1;
    } else {
      employees.unshift(next);
      created += 1;
    }
  });

  sheetRows(book, "jobs").forEach((row, index) => {
    if (!row.job_number || !row.job_name) {
      if (Object.values(row).some(Boolean)) errors.push(`jobs row ${index + 2}: job_number and job_name required`);
      return;
    }
    const existing = jobs.find((job) => job.number === row.job_number);
    const next: Job = {
      id: existing?.id ?? newId("job"),
      name: row.job_name,
      number: row.job_number,
      address: row.street_address ?? "",
      city: row.city ?? "",
      state: row.state ?? "",
      postalCode: row.postal_code ?? "",
      timezone: row.timezone || "America/Phoenix",
      client: row.client_name ?? "",
      status: (row.status as Job["status"]) || "active",
      startDate: row.start_date ?? "",
      endDate: row.end_date ?? "",
      superintendentId: employeeByNumber(employees, row.superintendent_number ?? "")?.id ?? existing?.superintendentId ?? "",
      safetyContactId: employeeByNumber(employees, row.safety_contact_number ?? "")?.id ?? existing?.safetyContactId ?? "",
      phone: row.job_phone ?? "",
      jobType: row.job_type ?? "",
      description: row.description ?? "",
      assignedEmployeeIds: idsFromNumbers(row.assigned_employee_numbers ?? "", employees),
    };
    if (existing) {
      jobs[jobs.findIndex((job) => job.id === existing.id)] = next;
      updated += 1;
    } else {
      jobs.unshift(next);
      created += 1;
    }
  });

  sheetRows(book, "daily_logs").forEach((row, index) => {
    if (!row.job_number || !row.log_date) {
      if (Object.values(row).some(Boolean)) errors.push(`daily_logs row ${index + 2}: job_number and log_date required`);
      return;
    }
    const job = jobs.find((item) => item.number === row.job_number);
    if (!job) {
      errors.push(`daily_logs row ${index + 2}: unknown job_number ${row.job_number}`);
      return;
    }
    const existing = trackers.find((tracker) => tracker.jobId === job.id && tracker.date === row.log_date);
    const weather = emptyWeather();
    weather.condition = row.weather_condition || weather.condition;
    weather.highF = Number(row.temp_high_f) || 0;
    weather.lowF = Number(row.temp_low_f) || 0;
    weather.wind = row.wind ?? "";
    weather.precipitation = row.precipitation ?? "";
    weather.notes = row.weather_notes ?? "";
    weather.delay = parseYn(row.weather_delay);
    weather.hoursLost = Number(row.weather_hours_lost) || 0;

    const next: JobTracker = {
      id: existing?.id ?? newId("trk"),
      jobId: job.id,
      date: row.log_date,
      arrivalAt: row.arrival_at ?? "",
      departureAt: row.departure_at ?? "",
      status: row.status === "signed" || row.status === "submitted" || row.status === "draft" ? row.status : existing?.status ?? "draft",
      preparedByName: row.prepared_by_name || existing?.preparedByName || "",
      preparedByRole: row.prepared_by_role || existing?.preparedByRole || "",
      createdByManagerId: existing?.createdByManagerId ?? current.managers[0]?.id ?? "",
      updatedByManagerId: existing?.updatedByManagerId ?? current.managers[0]?.id ?? "",
      assignedEmployeeIds: idsFromNumbers(row.assigned_employee_numbers ?? "", employees),
      weather,
      workCompleted: row.work_completed ?? "",
      workPlanned: row.work_planned_tomorrow ?? "",
      jobDescription: row.job_description || job.description,
      siteCondition: row.site_condition || "good",
      toolboxTopic: row.toolbox_topic ?? "",
      toolboxLeader: existing?.toolboxLeader ?? "",
      incidents: parseYn(row.incidents),
      incidentNotes: row.incident_notes || "None",
      nearMissNotes: row.near_miss_notes || "None",
      safetyNotes: row.safety_notes ?? "",
      ppeVerified: parseYn(row.ppe_verified),
      safetyItems: existing?.safetyItems ?? [],
      delay: parseYn(row.delay),
      delayType: (row.delay_type as JobTracker["delayType"]) || "",
      delayHours: Number(row.delay_hours) || 0,
      delayNotes: row.delay_notes ?? "",
      crew: existing?.crew ?? [],
      visitors: existing?.visitors ?? [],
      equipment: existing?.equipment ?? [],
      materials: existing?.materials ?? [],
      inspections: existing?.inspections ?? [],
      notes: existing?.notes ?? "",
      comments: existing?.comments ?? [],
      signature: {
        ...(existing?.signature ?? emptySignature()),
        signerName: row.signer_name ?? existing?.signature.signerName ?? "",
        signerRole: row.signer_role ?? existing?.signature.signerRole ?? "",
        signedAt: row.signed_at ?? existing?.signature.signedAt ?? "",
      },
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (existing) {
      trackers[trackers.findIndex((tracker) => tracker.id === existing.id)] = next;
      updated += 1;
    } else {
      trackers.unshift(next);
      created += 1;
    }
  });

  return { employees, jobs, trackers, errors, created, updated };
}

export function detectTrackerMapping(headers: string[]): { column: string; field: string }[] {
  const normalized = headers.map((header) => header.trim().toLowerCase().replace(/\s+/g, "_"));
  return TRACKER_COLUMNS.filter((field) => normalized.includes(field)).map((field) => ({ column: field, field }));
}

export function headersFromWorkbook(data: ArrayBuffer, preferredSheet = "daily_logs"): string[] {
  const book = XLSX.read(data, { type: "array" });
  const sheet = book.Sheets[preferredSheet] ?? book.Sheets[book.SheetNames[0]];
  if (!sheet) return [];
  const rows = XLSX.utils.sheet_to_json<Row>(sheet, { defval: "", raw: false });
  return rows[0] ? Object.keys(rows[0]) : [];
}
