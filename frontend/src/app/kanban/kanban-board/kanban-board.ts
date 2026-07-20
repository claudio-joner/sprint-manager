import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './kanban-board.html',
  styleUrl: './kanban-board.css'
})
export class KanbanBoardComponent implements OnInit {

  @Input() projectId!: number;

  columns = [
    { id: 'SIN_ASIGNAR', label: 'Sin asignar', tasks: [] as any[] },
    { id: 'EN_PROGRESO', label: 'En progreso', tasks: [] as any[] },
    { id: 'BLOQUEADA', label: 'Bloqueada', tasks: [] as any[] },
    { id: 'EN_REVISION', label: 'En revisión', tasks: [] as any[] },
    { id: 'COMPLETADA', label: 'Completada', tasks: [] as any[] }
  ];

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.taskService.getAll().subscribe({
      next: (data) => {
        data.forEach(task => {
          const column = this.columns.find(c => c.id === task.status);
          if (column) column.tasks.push(task);
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.log('error:', err)
    });
  }

  drop(event: CdkDragDrop<any[]>, newStatus: string): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const task = event.container.data[event.currentIndex];
      this.taskService.updateStatus(task.id, newStatus).subscribe();
    }
  }

  getColumnIds(): string[] {
    return this.columns.map(c => c.id);
  }
}