import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kanban-board.html',
  styleUrl: './kanban-board.css'
})
export class KanbanBoardComponent implements OnInit {

  @Input() projectId!: number;

  columns = [
    { id: 'SIN_ASIGNAR', label: 'Sin asignar' },
    { id: 'EN_PROGRESO', label: 'En progreso' },
    { id: 'BLOQUEADA', label: 'Bloqueada' },
    { id: 'EN_REVISION', label: 'En revisión' },
    { id: 'COMPLETADA', label: 'Completada' }
  ];

  tasks: any[] = [];

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.taskService.getAll().subscribe({
      next: (data) => {
        this.tasks = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.log('error:', err)
    });
  }

  getTasksByStatus(status: string): any[] {
    return this.tasks.filter(t => t.status === status);
  }
}