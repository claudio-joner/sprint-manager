import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project';
import { ModalComponent } from '../shared/modal/modal';
import { PieChartComponent, PieChartSlice } from '../shared/pie-chart/pie-chart';
import { getProjectTasks } from '../shared/project-tasks.util';
import { getLastProjectId } from '../shared/last-project.util';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, PieChartComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  currentDate: string = '';
  startedProjects: any[] = [];
  finishedProjects: any[] = [];
  lastProject: any = null;

  showProjectModal = false;

  pageSize = 5;
  startedPage = 1;
  finishedPage = 1;

  newProject = { name: '', client: '', leader: '', totalHours: null, hoursPerSprint: null, startDate: '', estimatedEndDate: '' };

  constructor(
    private projectService: ProjectService,
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
        this.startedPage = Math.min(this.startedPage, this.totalStartedPages);
        this.finishedPage = Math.min(this.finishedPage, this.totalFinishedPages);
        this.cdr.markForCheck();
      },
      error: (err) => console.log('error:', err)
    });
  }

  get pieChartData(): PieChartSlice[] {
    return [
      { label: 'Iniciados', value: this.startedProjects.length, color: 'var(--status-revision)' },
      { label: 'Finalizados', value: this.finishedProjects.length, color: 'var(--status-bloqueada)' }
    ];
  }

  get totalStartedPages(): number {
    return Math.max(1, Math.ceil(this.startedProjects.length / this.pageSize));
  }

  get pagedStartedProjects(): any[] {
    const start = (this.startedPage - 1) * this.pageSize;
    return this.startedProjects.slice(start, start + this.pageSize);
  }

  get totalFinishedPages(): number {
    return Math.max(1, Math.ceil(this.finishedProjects.length / this.pageSize));
  }

  get pagedFinishedProjects(): any[] {
    const start = (this.finishedPage - 1) * this.pageSize;
    return this.finishedProjects.slice(start, start + this.pageSize);
  }

  onPageSizeChange(): void {
    this.startedPage = 1;
    this.finishedPage = 1;
  }

  goToStartedPage(page: number): void {
    this.startedPage = Math.min(Math.max(1, page), this.totalStartedPages);
  }

  goToFinishedPage(page: number): void {
    this.finishedPage = Math.min(Math.max(1, page), this.totalFinishedPages);
  }

  closeProject(id: number, event: Event): void {
    event.stopPropagation();
    this.projectService.close(id).subscribe({
      next: () => this.loadProjects(),
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
}
