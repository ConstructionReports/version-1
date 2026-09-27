import { emptyRowId, nowTime, todayIso } from "./format";
import { SIGNATURE_INTENT } from "../types";
import type {
  CrewRow,
  Employee,
  EquipmentRow,
  InspectionRow,
  Job,
  JobTracker,
  MaterialRow,
  SafetyItem,
  TrackerSignature,
  VisitorRow,
  Weather,
} from "../types";

export function emptyWeather(): Weather {
  return {
    condition: "Clear",
    highF: 95,
    lowF: 72,
    wind: "",
    precipitation: "None",
    notes: "",
    delay: false,
    hoursLost: 0,
  };
}

export function emptySignature(role = "Superintendent"): TrackerSignature {
  return {
    status: "unsigned",
    signerName: "",
    signerRole: role,
    signerEmployeeId: "",
    signedAt: "",
    method: "",
    imageDataUrl: "",
    typedName: "",
    intentAccepted: false,
    intentStatement: SIGNATURE_INTENT,
  };
}

export function emptyCrew(): CrewRow {
  return {
    id: emptyRowId(),
    employeeId: "",
    company: "Self",
    trade: "",
    count: 0,
    hours: 8,
    areaOrTask: "",
    notes: "",
  };
}

export function emptySafetyItem(): SafetyItem {
  return { id: emptyRowId(), label: "", observed: false, notes: "" };
}

export function emptyVisitor(): VisitorRow {
  return { id: emptyRowId(), name: "", company: "", role: "", purpose: "", notes: "" };
}

export function emptyEquipment(): EquipmentRow {
  return {
    id: emptyRowId(),
    name: "",
    status: "in_use",
    hoursOperating: 0,
    inspected: false,
    notes: "",
  };
}

export function emptyMaterial(): MaterialRow {
  return { id: emptyRowId(), item: "", quantity: "", vendor: "", ticket: "", notes: "" };
}

export function emptyInspection(): InspectionRow {
  return {
    id: emptyRowId(),
    type: "",
    inspector: "",
    entity: "",
    area: "",
    result: "pending",
    notes: "",
  };
}

export function emptyEmployee(): Employee {
  return {
    id: "",
    employeeNumber: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    role: "",
    trade: "",
    hireDate: todayIso(),
    status: "active",
    assignable: true,
    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactPhone: "",
    certifications: [],
    notes: "",
  };
}

export function emptyJob(): Job {
  return {
    id: "",
    name: "",
    number: "",
    address: "",
    city: "",
    state: "AZ",
    postalCode: "",
    timezone: "America/Phoenix",
    client: "",
    status: "active",
    startDate: todayIso(),
    endDate: "",
    superintendentId: "",
    safetyContactId: "",
    phone: "",
    jobType: "",
    description: "",
    assignedEmployeeIds: [],
  };
}

export function emptyTracker(job: Job, managerId: string, managerName: string, role: string): JobTracker {
  const now = new Date().toISOString();
  return {
    id: "",
    jobId: job.id,
    date: todayIso(),
    arrivalAt: nowTime(),
    departureAt: "",
    status: "draft",
    preparedByName: managerName,
    preparedByRole: role,
    createdByManagerId: managerId,
    updatedByManagerId: managerId,
    assignedEmployeeIds: [...job.assignedEmployeeIds],
    weather: emptyWeather(),
    workCompleted: "",
    workPlanned: "",
    jobDescription: job.description,
    siteCondition: "good",
    toolboxTopic: "",
    toolboxLeader: "",
    incidents: false,
    incidentNotes: "None",
    nearMissNotes: "None",
    safetyNotes: "",
    ppeVerified: false,
    safetyItems: [],
    delay: false,
    delayType: "",
    delayHours: 0,
    delayNotes: "",
    crew: [emptyCrew()],
    visitors: [],
    equipment: [],
    materials: [],
    inspections: [],
    notes: "",
    comments: [],
    signature: emptySignature(role),
    createdAt: now,
    updatedAt: now,
  };
}
