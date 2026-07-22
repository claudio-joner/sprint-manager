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
import { ModalComponent } from '../../shared/modal/modal';
import { getProjectTasks } from '../../shared/project-tasks.util';
import { setLastProjectId } from '../../shared/last-project.util';


@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, KanbanBoardComponent, ModalComponent],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css'
})
export class ProjectDetailComponent implements OnInit {

  project: any = null;
  projectId!: number;

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
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.log('error:', err);
      }
    });
  }

  getProjectTasks(): any[] {
    return getProjectTasks(this.project);
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
