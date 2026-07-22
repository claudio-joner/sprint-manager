import { Component, Input, Output, EventEmitter, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './kanban-board.html',
  styleUrl: './kanban-board.css'
})
export class KanbanBoardComponent implements OnChanges {

  @Input() tasks: any[] = [];
  @Output() taskDeleted = new EventEmitter<number>();

  columns = [
    { id: 'SIN_ASIGNAR', label: 'Sin asignar', tasks: [] as any[] },
    { id: 'EN_PROGESO', label: 'En progreso', tasks: [] as any[] },
    { id: 'BLOQUEADA', label: 'Bloqueada', tasks: [] as any[] },
    { id: 'EN_REVISION', label: 'En revisión', tasks: [] as any[] },
    { id: 'COMPLETADA', label: 'Completada', tasks: [] as any[] }
  ];

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(): void {
    this.columns.forEach(column => column.tasks = []);
    this.tasks.forEach(task => {
      const column = this.columns.find(c => c.id === task.status);
      if (column) column.tasks.push(task);
    });
    this.cdr.markForCheck();
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
      task.status = newStatus;
      this.taskService.updateStatus(task.id, newStatus).subscribe();
    }
    this.cdr.markForCheck();
  }

  getColumnIds(): string[] {
    return this.columns.map(c => c.id);
  }

  /**
   * Una tarea solo puede avanzar en el flujo del kanban, nunca retroceder
   * a una columna anterior a la que ya alcanzó.
   */
  canEnter = (drag: CdkDrag<any>, drop: CdkDropList<any>): boolean => {
    const task = drag.data;
    const fromIndex = this.columns.findIndex(c => c.id === task.status);
    const toIndex = this.columns.findIndex(c => c.id === drop.id);
    return fromIndex === -1 || toIndex >= fromIndex;
  };

  deleteTask(id: number, column: any): void {
    this.taskService.delete(id).subscribe({
      next: () => {
        column.tasks = column.tasks.filter((t: any) => t.id !== id);
        this.taskDeleted.emit(id);
      },
      error: (err) => console.log('error:', err)
    });
  }
}
