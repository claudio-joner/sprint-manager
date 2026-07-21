const LAST_PROJECT_KEY = 'sprintmanager.lastProjectId';

export function setLastProjectId(id: number): void {
  localStorage.setItem(LAST_PROJECT_KEY, String(id));
}

export function getLastProjectId(): number | null {
  const value = localStorage.getItem(LAST_PROJECT_KEY);
  return value ? Number(value) : null;
}
