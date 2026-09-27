import { useMemo, useState } from "react";
import { getCurrentManagerId, setCurrentManagerId } from "./session";
import { listManagers } from "./storage";

export function useManager() {
  const managers = useMemo(() => listManagers(), []);
  const [managerId, setManagerId] = useState(() => getCurrentManagerId(managers[0]?.id ?? ""));
  const manager = managers.find((item) => item.id === managerId) ?? managers[0];

  function switchManager(id: string) {
    setCurrentManagerId(id);
    setManagerId(id);
  }

  return { manager, managers, switchManager };
}
