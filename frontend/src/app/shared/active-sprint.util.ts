const ACTIVE_SPRINT_PREFIX = 'sprintmanager.activeSprintId.';

export function getActiveSprintId(projectId: number): number | null {
  const value = localStorage.getItem(ACTIVE_SPRINT_PREFIX + projectId);
  return value ? Number(value) : null;
}

export function setActiveSprintId(projectId: number, sprintId: number): void {
  localStorage.setItem(ACTIVE_SPRINT_PREFIX + projectId, String(sprintId));
}
