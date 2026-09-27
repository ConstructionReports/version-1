import { beforeEach, describe, expect, it } from "vitest";
import { deleteReport, getReport, loadStore, resetStore, saveReport } from "./storage";
import type { DailyReport } from "../types";

const sample: DailyReport = {
  id: "rpt-test-1",
  projectId: "proj-rio-verde",
  date: "2026-09-27",
  status: "draft",
  weather: { condition: "Clear", highF: 90, lowF: 70 },
  crew: [{ trade: "Concrete", count: 3 }],
  workCompleted: "Test pour",
  delays: "",
  safety: "",
  materials: "",
  visitors: "",
  notes: "",
  author: "Test Super",
  createdAt: "2026-09-27T12:00:00.000Z",
};

describe("report storage", () => {
  beforeEach(() => {
    localStorage.clear();
    resetStore();
  });

  it("seeds projects and reports on first load", () => {
    const store = loadStore();
    expect(store.projects.length).toBeGreaterThan(0);
    expect(store.reports.length).toBeGreaterThan(0);
  });

  it("saves and reads a report", () => {
    saveReport(sample);
    const found = getReport(sample.id);
    expect(found?.workCompleted).toBe("Test pour");
    expect(found?.crew[0]?.count).toBe(3);
  });

  it("deletes a report", () => {
    saveReport(sample);
    deleteReport(sample.id);
    expect(getReport(sample.id)).toBeUndefined();
  });
});
