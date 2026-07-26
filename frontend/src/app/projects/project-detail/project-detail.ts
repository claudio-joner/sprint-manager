import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';
import { ProjectService } from '../../services/project';
import { MemberService } from '../../services/member';
import { SprintService } from '../../services/sprint';
import { FunctionalityService } from '../../services/functionality';
import { TaskService } from '../../services/task';
import { KanbanBoardComponent } from '../../kanban/kanban-board/kanban-board';
import { FunctionalityBoardComponent } from '../../kanban/functionality-board/functionality-board';
import { ModalComponent } from '../../shared/modal/modal';
import { PieChartComponent, PieChartSlice } from '../../shared/pie-chart/pie-chart';
import { getProjectTasks } from '../../shared/project-tasks.util';
import { setLastProjectId } from '../../shared/last-project.util';
import { getActiveSprintId, setActiveSprintId } from '../../shared/active-sprint.util';

const SPRINT_CHART_PALETTE = ['#8b5cf6', '#06b6d4', '#f97316', '#ec4899', '#84cc16', '#3b82f6', '#eab308'];

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, KanbanBoardComponent, FunctionalityBoardComponent, ModalComponent, PieChartComponent],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css'
})
export class ProjectDetailComponent implements OnInit {

  project: any = null;
  projectId!: number;

  activeSprintId: number | null = null;
  chartView: 'status' | 'sprint' = 'status';
  taskFilterFunctionalityId: number | null = null;

  showMemberModal = false;
  showSprintModal = false;
  showFunctionalityModal = false;
  showTaskModal = false;

  newMember = { name: '', email: '' };
  newSprint = { numero: null, totalHours: null };
  newFunctionality = { name: '', observation: '', priority: 'MEDIUM', status: 'PENDING', sprintId: null };
  newTask = this.emptyTask();

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private memberService: MemberService,
    private sprintService: SprintService,
    private functionalityService: FunctionalityService,
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  private emptyTask() {
    return {
      name: '',
      comments: '',
      estimatedTime: null,
      startDate: '',
      endDate: '',
      sprintId: null,
      memberId: null,
      functionalityId: null
    };
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectId = Number(id);
      setLastProjectId(this.projectId);
      this.loadProject();
    }
  }

  loadProject(): void {
    this.projectService.getById(this.projectId).subscribe({
      next: (data) => {
        this.project = data;
        this.initActiveSprint();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.log('error:', err);
      }
    });
  }

  private initActiveSprint(): void {
    const sprints = this.project?.sprints ?? [];
    const stored = getActiveSprintId(this.projectId);
    if (stored && sprints.some((s: any) => s.id === stored)) {
      this.activeSprintId = stored;
    } else if (sprints.length > 0) {
      this.activeSprintId = sprints.reduce((max: any, s: any) => (s.numero > max.numero ? s : max), sprints[0]).id;
    } else {
      this.activeSprintId = null;
    }
  }

  activateSprint(id: number): void {
    this.activeSprintId = id;
    setActiveSprintId(this.projectId, id);
  }

  getProjectTasks(): any[] {
    return getProjectTasks(this.project);
  }

  get remainingHours(): number {
    if (!this.project) return 0;
    const committed = this.getProjectTasks().reduce((sum, t) => sum + (t.estimatedTime ?? 0), 0);
    return (this.project.totalHours ?? 0) - committed;
  }

  get activeSprintFunctionalities(): any[] {
    if (!this.project || this.activeSprintId == null) return [];
    return (this.project.funcionalities ?? []).filter((f: any) => f.sprint?.id === this.activeSprintId);
  }

  get taskStatusChartData(): PieChartSlice[] {
    const tasks = this.getProjectTasks();
    const counts: Record<string, number> = {
      SIN_ASIGNAR: 0, EN_PROGESO: 0, EN_REVISION: 0, BLOQUEADA: 0, COMPLETADA: 0
    };
    tasks.forEach((t: any) => { if (counts[t.status] !== undefined) counts[t.status]++; });
    return [
      { label: 'Sin asignar', value: counts['SIN_ASIGNAR'], color: 'var(--status-sin-asignar)' },
      { label: 'En progreso', value: counts['EN_PROGESO'], color: 'var(--status-progreso)' },
      { label: 'En revisión', value: counts['EN_REVISION'], color: 'var(--status-revision)' },
      { label: 'Bloqueada', value: counts['BLOQUEADA'], color: 'var(--status-bloqueada)' },
      { label: 'Completada', value: counts['COMPLETADA'], color: 'var(--status-completada)' }
    ];
  }

  get sprintDistributionChartData(): PieChartSlice[] {
    const sprints = this.project?.sprints ?? [];
    const allTasks = this.getProjectTasks();
    const countedIds = new Set<number>();
    const slices: PieChartSlice[] = sprints.map((s: any, i: number) => {
      const ids = (s.tasks ?? []).map((t: any) => t.id);
      ids.forEach((id: number) => countedIds.add(id));
      return {
        label: `Sprint ${s.numero}`,
        value: ids.length,
        color: SPRINT_CHART_PALETTE[i % SPRINT_CHART_PALETTE.length]
      };
    });
    const unassigned = allTasks.filter((t: any) => !countedIds.has(t.id)).length;
    if (unassigned > 0) {
      slices.push({ label: 'Sin sprint', value: unassigned, color: 'var(--text-muted)' });
    }
    return slices;
  }

  get chartData(): PieChartSlice[] {
    return this.chartView === 'status' ? this.taskStatusChartData : this.sprintDistributionChartData;
  }

  toggleChartView(): void {
    this.chartView = this.chartView === 'status' ? 'sprint' : 'status';
  }

  get filteredTasks(): any[] {
    const tasks = this.getProjectTasks();
    if (this.taskFilterFunctionalityId == null) return tasks;
    const functionality = (this.project?.funcionalities ?? []).find((f: any) => f.id === this.taskFilterFunctionalityId);
    const ids = new Set((functionality?.tasks ?? []).map((t: any) => t.id));
    return tasks.filter((t: any) => ids.has(t.id));
  }

  get taskFilterFunctionalityName(): string | null {
    const f = (this.project?.funcionalities ?? []).find((x: any) => x.id === this.taskFilterFunctionalityId);
    return f ? f.name : null;
  }

  viewFunctionalityTasks(functionalityId: number): void {
    this.taskFilterFunctionalityId = functionalityId;
  }

  clearTaskFilter(): void {
    this.taskFilterFunctionalityId = null;
  }

  createMember(): void {
    const payload = { ...this.newMember, project: { id: this.projectId } };
    this.memberService.create(payload).subscribe({
      next: () => {
        this.newMember = { name: '', email: '' };
        this.showMemberModal = false;
        this.loadProject();
      },
      error: (err) => console.log('error:', err)
    });
  }

  createSprint(): void {
    const payload = { ...this.newSprint, project: { id: this.projectId } };
    this.sprintService.create(payload).subscribe({
      next: () => {
        this.newSprint = { numero: null, totalHours: null };
        this.showSprintModal = false;
        this.loadProject();
      },
      error: (err) => console.log('error:', err)
    });
  }

  createFunctionality(): void {
    const { sprintId, ...rest } = this.newFunctionality;
    const payload: any = { ...rest, project: { id: this.projectId } };
    if (sprintId) {
      payload.sprint = { id: sprintId };
    }
    this.functionalityService.create(payload).subscribe({
      next: () => {
        this.newFunctionality = { name: '', observation: '', priority: 'MEDIUM', status: 'PENDING', sprintId: null };
        this.showFunctionalityModal = false;
        this.loadProject();
      },
      error: (err) => console.log('error:', err)
    });
  }

  createTask(): void {
    const { sprintId, memberId, functionalityId, ...rest } = this.newTask;
    const payload: any = {
      ...rest,
      status: 'SIN_ASIGNAR',
      workedTime: 0,
      createdDate: new Date().toISOString().slice(0, 10)
    };
    if (sprintId) payload.sprint = { id: sprintId };
    if (memberId) payload.member = { id: memberId };
    if (functionalityId) payload.functionality = { id: functionalityId };

    this.taskService.create(payload).subscribe({
      next: () => {
        this.newTask = this.emptyTask();
        this.showTaskModal = false;
        this.loadProject();
      },
      error: (err) => console.log('error:', err)
    });
  }

  deleteMember(id: number): void {
    this.memberService.delete(id).subscribe({
      next: () => this.loadProject(),
      error: (err) => console.log('error:', err)
    });
  }

  deleteSprint(id: number): void {
    this.sprintService.delete(id).subscribe({
      next: () => this.loadProject(),
      error: (err) => console.log('error:', err)
    });
  }

  deleteFunctionality(id: number): void {
    this.functionalityService.delete(id).subscribe({
      next: () => this.loadProject(),
      error: (err) => console.log('error:', err)
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
