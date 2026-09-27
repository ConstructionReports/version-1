import { beforeEach, describe, expect, it } from "vitest";
import { parseWorkbook, storeToSheets, TRACKER_COLUMNS } from "./excel";
import { getEmployee, loadStore, resetStore, saveEmployee, saveTracker } from "./storage";

describe("v2 store", () => {
  beforeEach(() => {
    localStorage.clear();
    resetStore();
  });

  it("seeds managers, employees, jobs, and trackers", () => {
    const store = loadStore();
    expect(store.schemaVersion).toBe(2);
    expect(store.managers.length).toBeGreaterThan(0);
    expect(store.employees.length).toBeGreaterThan(0);
    expect(store.jobs.length).toBeGreaterThan(0);
    expect(store.trackers.length).toBeGreaterThan(0);
  });

  it("saves an employee profile", () => {
    const store = loadStore();
    const sample = {
      ...store.employees[0],
      id: "emp-test",
      employeeNumber: "E-999",
      firstName: "Test",
      lastName: "Hand",
    };
    saveEmployee(sample);
    expect(getEmployee("emp-test")?.trade).toBe(sample.trade);
  });

  it("updates a tracker without dropping comments", () => {
    const store = loadStore();
    const tracker = store.trackers[0];
    saveTracker({ ...tracker, workCompleted: "Updated pour notes" });
    const next = loadStore().trackers.find((item) => item.id === tracker.id);
    expect(next?.workCompleted).toBe("Updated pour notes");
    expect(next?.comments.length).toBe(tracker.comments.length);
  });
});

describe("excel mapping", () => {
  beforeEach(() => {
    localStorage.clear();
    resetStore();
  });

  it("exports daily_logs with the stable tracker columns", () => {
    const sheets = storeToSheets(loadStore());
    expect(sheets.daily_logs.length).toBeGreaterThan(0);
    for (const column of TRACKER_COLUMNS) {
      expect(sheets.daily_logs[0]).toHaveProperty(column);
    }
  });

  it("round-trips a tracker row through parseWorkbook", async () => {
    const { workbookFromStore } = await import("./excel");
    const store = loadStore();
    const book = workbookFromStore(store);
    const XLSX = await import("xlsx");
    const buffer = XLSX.write(book, { type: "array", bookType: "xlsx" }) as ArrayBuffer;
    const parsed = parseWorkbook(buffer, store);
    expect(parsed.errors).toEqual([]);
    expect(parsed.jobs.length).toBe(store.jobs.length);
    expect(parsed.employees.length).toBe(store.employees.length);
    expect(parsed.trackers.length).toBe(store.trackers.length);
  });
});
