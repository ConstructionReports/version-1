import { seedEmployees, seedJobs, seedManagers, seedTrackers } from "../data/seed";
import type { Employee, ImportAudit, Job, JobTracker, Manager, Store, TrackerComment } from "../types";

const KEY = "construction-reports.v2";
const LEGACY_KEY = "construction-reports.v1";

function emptyStore(): Store {
  return {
    schemaVersion: 2,
    managers: structuredClone(seedManagers),
    employees: structuredClone(seedEmployees),
    jobs: structuredClone(seedJobs),
    trackers: structuredClone(seedTrackers),
    importAudits: [],
  };
}

function isStore(value: unknown): value is Store {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Store;
  return (
    candidate.schemaVersion === 2 &&
    Array.isArray(candidate.managers) &&
    Array.isArray(candidate.employees) &&
    Array.isArray(candidate.jobs) &&
    Array.isArray(candidate.trackers)
  );
}

function readRaw(): Store {
  if (typeof localStorage === "undefined") {
    return emptyStore();
  }

  const raw = localStorage.getItem(KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (isStore(parsed)) {
        parsed.importAudits ??= [];
        return parsed;
      }
    } catch {
      /* reseeds */
    }
  }

  localStorage.removeItem(LEGACY_KEY);
  const seeded = emptyStore();
  localStorage.setItem(KEY, JSON.stringify(seeded));
  return seeded;
}

function writeRaw(store: Store): Store {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(store));
  }
  return store;
}

function upsert<T extends { id: string }>(rows: T[], row: T): T[] {
  const index = rows.findIndex((item) => item.id === row.id);
  if (index >= 0) {
    const next = [...rows];
    next[index] = row;
    return next;
  }
  return [row, ...rows];
}

export function loadStore(): Store {
  return readRaw();
}

export function resetStore(): Store {
  return writeRaw(emptyStore());
}

export function listManagers(): Manager[] {
  return readRaw().managers;
}

export function getManager(id: string): Manager | undefined {
  return readRaw().managers.find((manager) => manager.id === id);
}

export function listEmployees(): Employee[] {
  return [...readRaw().employees].sort((a, b) => a.lastName.localeCompare(b.lastName));
}

export function getEmployee(id: string): Employee | undefined {
  return readRaw().employees.find((employee) => employee.id === id);
}

export function saveEmployee(employee: Employee): Employee {
  const store = readRaw();
  store.employees = upsert(store.employees, employee);
  writeRaw(store);
  return employee;
}

export function deleteEmployee(id: string): void {
  const store = readRaw();
  store.employees = store.employees.filter((employee) => employee.id !== id);
  store.jobs = store.jobs.map((job) => ({
    ...job,
    assignedEmployeeIds: job.assignedEmployeeIds.filter((item) => item !== id),
    superintendentId: job.superintendentId === id ? "" : job.superintendentId,
    safetyContactId: job.safetyContactId === id ? "" : job.safetyContactId,
  }));
  writeRaw(store);
}

export function listJobs(): Job[] {
  return readRaw().jobs;
}

export function getJob(id: string): Job | undefined {
  return readRaw().jobs.find((job) => job.id === id);
}

export function saveJob(job: Job): Job {
  const store = readRaw();
  store.jobs = upsert(store.jobs, job);
  writeRaw(store);
  return job;
}

export function listTrackers(): JobTracker[] {
  return [...readRaw().trackers].sort((a, b) => b.date.localeCompare(a.date) || b.updatedAt.localeCompare(a.updatedAt));
}

export function listTrackersForJob(jobId: string): JobTracker[] {
  return listTrackers().filter((tracker) => tracker.jobId === jobId);
}

export function getTracker(id: string): JobTracker | undefined {
  return readRaw().trackers.find((tracker) => tracker.id === id);
}

export function saveTracker(tracker: JobTracker): JobTracker {
  const store = readRaw();
  store.trackers = upsert(store.trackers, tracker);
  writeRaw(store);
  return tracker;
}

export function deleteTracker(id: string): void {
  const store = readRaw();
  store.trackers = store.trackers.filter((tracker) => tracker.id !== id);
  writeRaw(store);
}

export function addTrackerComment(trackerId: string, comment: TrackerComment): JobTracker | undefined {
  const tracker = getTracker(trackerId);
  if (!tracker) return undefined;
  return saveTracker({
    ...tracker,
    comments: [...tracker.comments, comment],
    updatedAt: comment.at,
    updatedByManagerId: comment.managerId,
  });
}

export function recordImport(audit: ImportAudit): void {
  const store = readRaw();
  store.importAudits = [audit, ...store.importAudits].slice(0, 20);
  writeRaw(store);
}

export function listImportAudits(): ImportAudit[] {
  return readRaw().importAudits ?? [];
}

export function replaceImported(partial: {
  jobs?: Job[];
  employees?: Employee[];
  trackers?: JobTracker[];
}): Store {
  const store = readRaw();
  if (partial.jobs) {
    for (const job of partial.jobs) {
      store.jobs = upsert(store.jobs, job);
    }
  }
  if (partial.employees) {
    for (const employee of partial.employees) {
      store.employees = upsert(store.employees, employee);
    }
  }
  if (partial.trackers) {
    for (const tracker of partial.trackers) {
      store.trackers = upsert(store.trackers, tracker);
    }
  }
  return writeRaw(store);
}
