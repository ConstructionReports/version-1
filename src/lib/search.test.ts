import { describe, expect, it } from "vitest";
import { seedProjects, seedReports } from "../data/seed";
import type { DailyReport, Project } from "../types";
import { filterReportsByQuery, reportMatchesQuery } from "./search";

const sample: DailyReport = {
  id: "rpt-search-1",
  projectId: "proj-rio-verde",
  date: "2026-09-27",
  status: "draft",
  weather: { condition: "Clear", highF: 90, lowF: 70 },
  crew: [{ trade: "Concrete", count: 3 }],
  workCompleted: "Placed west wing slab",
  delays: "Ready-mix delayed 70 minutes",
  safety: "Near-miss at the taper; flagger redirected",
  materials: "Received 12 pallets of CMU",
  visitors: "City inspector on site for SOG pre-pour",
  notes: "Need elevator pit embed drawings",
  author: "Maya Ortiz",
  createdAt: "2026-09-27T12:00:00.000Z",
};

const rioVerde = seedProjects.find((project) => project.id === "proj-rio-verde") as Project;

function projectFor(projectId: string): Project | undefined {
  return seedProjects.find((project) => project.id === projectId);
}

describe("report search", () => {
  it("matches existing job, author, status, and work fields", () => {
    expect(reportMatchesQuery(sample, "west wing slab", rioVerde)).toBe(true);
    expect(reportMatchesQuery(sample, "maya ortiz", rioVerde)).toBe(true);
    expect(reportMatchesQuery(sample, "DRAFT", rioVerde)).toBe(true);
    expect(reportMatchesQuery(sample, "Rio Verde", rioVerde)).toBe(true);
    expect(reportMatchesQuery(sample, "CR-2604", rioVerde)).toBe(true);
    expect(reportMatchesQuery(sample, "scottsdale", rioVerde)).toBe(true);
  });

  it("matches delays, safety, materials, visitors, and notes", () => {
    expect(reportMatchesQuery(sample, "ready-mix delayed", rioVerde)).toBe(true);
    expect(reportMatchesQuery(sample, "near-miss", rioVerde)).toBe(true);
    expect(reportMatchesQuery(sample, "pallets of CMU", rioVerde)).toBe(true);
    expect(reportMatchesQuery(sample, "city inspector", rioVerde)).toBe(true);
    expect(reportMatchesQuery(sample, "elevator pit embed", rioVerde)).toBe(true);
  });

  it("treats a blank query as a match", () => {
    expect(reportMatchesQuery(sample, "   ", rioVerde)).toBe(true);
  });

  it("does not match unrelated text", () => {
    expect(reportMatchesQuery(sample, "asphalt milling", rioVerde)).toBe(false);
  });

  it("finds seeded delay and safety phrases across the daily log", () => {
    const delayHits = filterReportsByQuery(seedReports, "Ready-mix delayed", projectFor);
    expect(delayHits.map((report) => report.id)).toEqual(["rpt-rv-0926"]);

    const safetyHits = filterReportsByQuery(seedReports, "near-miss", projectFor);
    expect(safetyHits.map((report) => report.id)).toEqual(["rpt-i10-0926"]);

    const notesHits = filterReportsByQuery(seedReports, "elevator pit embed", projectFor);
    expect(notesHits.map((report) => report.id)).toEqual(["rpt-rv-0926"]);

    const visitorHits = filterReportsByQuery(seedReports, "Interior designer punch walk", projectFor);
    expect(visitorHits.map((report) => report.id)).toEqual(["rpt-ridge-0924"]);

    const materialHits = filterReportsByQuery(seedReports, "hollow-metal door", projectFor);
    expect(materialHits.map((report) => report.id)).toEqual(["rpt-rv-0926"]);
  });

  it("returns every report when the query is empty", () => {
    expect(filterReportsByQuery(seedReports, "", projectFor)).toHaveLength(seedReports.length);
  });
});
