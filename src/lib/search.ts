import type { DailyReport, Project } from "../types";

export type SearchableProject = Pick<Project, "name" | "number" | "city">;

export function reportSearchText(
  report: DailyReport,
  project?: SearchableProject,
): string {
  return [
    report.workCompleted,
    report.author,
    report.status,
    report.delays,
    report.safety,
    report.materials,
    report.visitors,
    report.notes,
    project?.name,
    project?.number,
    project?.city,
  ]
    .filter((part): part is string => Boolean(part))
    .join(" ")
    .toLowerCase();
}

export function reportMatchesQuery(
  report: DailyReport,
  query: string,
  project?: SearchableProject,
): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return reportSearchText(report, project).includes(needle);
}

export function filterReportsByQuery(
  reports: DailyReport[],
  query: string,
  projectFor: (projectId: string) => SearchableProject | undefined,
): DailyReport[] {
  const needle = query.trim();
  if (!needle) return reports;
  return reports.filter((report) =>
    reportMatchesQuery(report, needle, projectFor(report.projectId)),
  );
}
