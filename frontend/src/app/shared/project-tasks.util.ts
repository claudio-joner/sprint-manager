export function getProjectTasks(project: any): any[] {
  if (!project) return [];
  const fromSprints = (project.sprints ?? []).flatMap((s: any) => s.tasks ?? []);
  const fromFunctionalities = (project.funcionalities ?? []).flatMap((f: any) => f.tasks ?? []);
  const seen = new Set<number>();
  return [...fromSprints, ...fromFunctionalities].filter((task: any) => {
    if (seen.has(task.id)) return false;
    seen.add(task.id);
    return true;
  });
}
