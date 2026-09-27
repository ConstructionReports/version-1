import { seedProjects, seedReports } from "../data/seed";
import type { DailyReport, Project, Store } from "../types";

const KEY = "construction-reports.v1";

function emptyStore(): Store {
  return {
    projects: structuredClone(seedProjects),
    reports: structuredClone(seedReports),
  };
}

function readRaw(): Store {
  if (typeof localStorage === "undefined") {
    return emptyStore();
  }

  const raw = localStorage.getItem(KEY);
  if (!raw) {
    const seeded = emptyStore();
    localStorage.setItem(KEY, JSON.stringify(seeded));
    return seeded;
  }

  try {
    const parsed = JSON.parse(raw) as Store;
    if (!Array.isArray(parsed.projects) || !Array.isArray(parsed.reports)) {
      return emptyStore();
    }
    return parsed;
  } catch {
    return emptyStore();
  }
}

function writeRaw(store: Store): Store {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(store));
  }
  return store;
}

export function loadStore(): Store {
  return readRaw();
}

export function listProjects(): Project[] {
  return readRaw().projects;
}

export function getProject(id: string): Project | undefined {
  return readRaw().projects.find((project) => project.id === id);
}

export function listReports(): DailyReport[] {
  return [...readRaw().reports].sort((a, b) => b.date.localeCompare(a.date));
}

export function listReportsForProject(projectId: string): DailyReport[] {
  return listReports().filter((report) => report.projectId === projectId);
}

export function getReport(id: string): DailyReport | undefined {
  return readRaw().reports.find((report) => report.id === id);
}

export function saveReport(report: DailyReport): DailyReport {
  const store = readRaw();
  const index = store.reports.findIndex((item) => item.id === report.id);
  if (index >= 0) {
    store.reports[index] = report;
  } else {
    store.reports.unshift(report);
  }
  writeRaw(store);
  return report;
}

export function deleteReport(id: string): void {
  const store = readRaw();
  store.reports = store.reports.filter((report) => report.id !== id);
  writeRaw(store);
}

export function resetStore(): Store {
  return writeRaw(emptyStore());
}
