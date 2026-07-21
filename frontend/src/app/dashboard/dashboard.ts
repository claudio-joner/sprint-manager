import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project';
import { SprintService } from '../services/sprint';
import { MemberService } from '../services/member';
import { ModalComponent } from '../shared/modal/modal';
import { getProjectTasks } from '../shared/project-tasks.util';
import { getLastProjectId } from '../shared/last-project.util';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  currentDate: string = '';
  startedProjects: any[] = [];
  finishedProjects: any[] = [];
  lastProject: any = null;

  showProjectModal = false;
  showSprintModal = false;
  showMemberModal = false;

  newProject = { name: '', client: '', leader: '', totalHours: null, hoursPerSprint: null, startDate: '', estimatedEndDate: '' };
  newSprint = { projectId: null, numero: null, totalHours: null };
  newMember = { projectId: null, name: '', email: '' };

  constructor(
    private projectService: ProjectService,
    private sprintService: SprintService,
    private memberService: MemberService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentDate = new Date().toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getAll().subscribe({
      next: (data) => {
        this.startedProjects = data.filter(p => !p.realEndDate);
        this.finishedProjects = data.filter(p => !!p.realEndDate);
        this.loadLastProject(data);
        this.cdr.detectChanges();
      },
      error: (err) => console.log('error:', err)
    });
  }

  loadLastProject(projects: any[]): void {
    const lastId = getLastProjectId();
    this.lastProject = lastId ? (projects.find(p => p.id === lastId) ?? null) : null;
  }

  getUnresolvedTasksCount(project: any): number {
    return getProjectTasks(project).filter((t: any) => t.status !== 'COMPLETADA').length;
  }

  getLastCompletedTask(project: any): any {
    const completed = getProjectTasks(project).filter((t: any) => t.status === 'COMPLETADA');
    if (completed.length === 0) return null;
    return completed.reduce((latest, t) => (t.endDate > latest.endDate ? t : latest));
  }

  getLatestSprintNumber(project: any): number | null {
    if (!project.sprints || project.sprints.length === 0) return null;
    return Math.max(...project.sprints.map((s: any) => s.numero));
  }

  goToProject(id: number): void {
    this.router.navigate(['/projects', id]);
  }

  createProject(): void {
    this.projectService.create(this.newProject).subscribe({
      next: () => {
        this.newProject = { name: '', client: '', leader: '', totalHours: null, hoursPerSprint: null, startDate: '', estimatedEndDate: '' };
        this.showProjectModal = false;
        this.loadProjects();
      },
      error: (err) => console.log('error:', err)
    });
  }

  createSprint(): void {
    const { projectId, ...rest } = this.newSprint;
    const payload = { ...rest, project: { id: projectId } };
    this.sprintService.create(payload).subscribe({
      next: () => {
        this.newSprint = { projectId: null, numero: null, totalHours: null };
        this.showSprintModal = false;
        this.loadProjects();
      },
      error: (err) => console.log('error:', err)
    });
  }

  createMember(): void {
    const { projectId, ...rest } = this.newMember;
    const payload = { ...rest, project: { id: projectId } };
    this.memberService.create(payload).subscribe({
      next: () => {
        this.newMember = { projectId: null, name: '', email: '' };
        this.showMemberModal = false;
        this.loadProjects();
      },
      error: (err) => console.log('error:', err)
    });
  }
}
