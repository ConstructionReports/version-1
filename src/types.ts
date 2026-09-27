export type ReportStatus = "draft" | "submitted";
export type ProjectStatus = "active" | "punch" | "closed";

export type Weather = {
  condition: string;
  highF: number;
  lowF: number;
};

export type CrewCount = {
  trade: string;
  count: number;
};

export type Project = {
  id: string;
  name: string;
  number: string;
  address: string;
  city: string;
  state: string;
  client: string;
  superintendent: string;
  status: ProjectStatus;
  startDate: string;
};

export type DailyReport = {
  id: string;
  projectId: string;
  date: string;
  status: ReportStatus;
  weather: Weather;
  crew: CrewCount[];
  workCompleted: string;
  delays: string;
  safety: string;
  materials: string;
  visitors: string;
  notes: string;
  author: string;
  createdAt: string;
};

export type Store = {
  projects: Project[];
  reports: DailyReport[];
};
