const KEY = "construction-reports.current-manager";

export function getCurrentManagerId(fallback: string): string {
  if (typeof localStorage === "undefined") return fallback;
  return localStorage.getItem(KEY) || fallback;
}

export function setCurrentManagerId(id: string): void {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(KEY, id);
  }
}
