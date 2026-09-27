export type JobStatus = "active" | "punch" | "closed" | "pending";
export type TrackerStatus = "draft" | "submitted" | "signed";
export type EmployeeStatus = "active" | "inactive";
export type ManagerRole = "superintendent" | "project_manager" | "safety";
export type SignatureMethod = "drawn" | "typed";
export type DelayType = "weather" | "material" | "labor" | "equipment" | "access" | "other";
export type InspectionResult = "pass" | "fail" | "pending" | "not_inspected";
export type EquipmentStatus = "in_use" | "idle" | "out_of_order";

export type Weather = {
  condition: string;
  highF: number;
  lowF: number;
  wind: string;
  precipitation: string;
  notes: string;
  delay: boolean;
  hoursLost: number;
};

export type Certification = {
  id: string;
  name: string;
  expiresOn: string;
  notes: string;
};

export type Employee = {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: string;
  trade: string;
  hireDate: string;
  status: EmployeeStatus;
  assignable: boolean;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  certifications: Certification[];
  notes: string;
};

export type Manager = {
  id: string;
  employeeId: string;
  name: string;
  role: ManagerRole;
  email: string;
};

export type Job = {
  id: string;
  name: string;
  number: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  timezone: string;
  client: string;
  status: JobStatus;
  startDate: string;
  endDate: string;
  superintendentId: string;
  safetyContactId: string;
  phone: string;
  jobType: string;
  description: string;
  assignedEmployeeIds: string[];
};

export type CrewRow = {
  id: string;
  employeeId: string;
  company: string;
  trade: string;
  count: number;
  hours: number;
  areaOrTask: string;
  notes: string;
};

export type SafetyItem = {
  id: string;
  label: string;
  observed: boolean;
  notes: string;
};

export type VisitorRow = {
  id: string;
  name: string;
  company: string;
  role: string;
  purpose: string;
  notes: string;
};

export type EquipmentRow = {
  id: string;
  name: string;
  status: EquipmentStatus;
  hoursOperating: number;
  inspected: boolean;
  notes: string;
};

export type MaterialRow = {
  id: string;
  item: string;
  quantity: string;
  vendor: string;
  ticket: string;
  notes: string;
};

export type InspectionRow = {
  id: string;
  type: string;
  inspector: string;
  entity: string;
  area: string;
  result: InspectionResult;
  notes: string;
};

export type TrackerComment = {
  id: string;
  managerId: string;
  authorName: string;
  body: string;
  at: string;
};

export type TrackerSignature = {
  status: "unsigned" | "signed";
  signerName: string;
  signerRole: string;
  signerEmployeeId: string;
  signedAt: string;
  method: SignatureMethod | "";
  imageDataUrl: string;
  typedName: string;
  intentAccepted: boolean;
  intentStatement: string;
};

export type JobTracker = {
  id: string;
  jobId: string;
  date: string;
  arrivalAt: string;
  departureAt: string;
  status: TrackerStatus;
  preparedByName: string;
  preparedByRole: string;
  createdByManagerId: string;
  updatedByManagerId: string;
  assignedEmployeeIds: string[];
  weather: Weather;
  workCompleted: string;
  workPlanned: string;
  jobDescription: string;
  siteCondition: string;
  toolboxTopic: string;
  toolboxLeader: string;
  incidents: boolean;
  incidentNotes: string;
  nearMissNotes: string;
  safetyNotes: string;
  ppeVerified: boolean;
  safetyItems: SafetyItem[];
  delay: boolean;
  delayType: DelayType | "";
  delayHours: number;
  delayNotes: string;
  crew: CrewRow[];
  visitors: VisitorRow[];
  equipment: EquipmentRow[];
  materials: MaterialRow[];
  inspections: InspectionRow[];
  notes: string;
  comments: TrackerComment[];
  signature: TrackerSignature;
  createdAt: string;
  updatedAt: string;
};

export type ImportAudit = {
  id: string;
  fileName: string;
  at: string;
  managerId: string;
  created: number;
  updated: number;
  errors: string[];
};

export type Store = {
  schemaVersion: 2;
  managers: Manager[];
  employees: Employee[];
  jobs: Job[];
  trackers: JobTracker[];
  importAudits: ImportAudit[];
};

export const SIGNATURE_INTENT =
  "I am signing this job tracker as an accurate record of work on this job for this date.";
