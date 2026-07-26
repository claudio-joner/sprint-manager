import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-functionality-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './functionality-board.html',
  styleUrl: './functionality-board.css'
})
export class FunctionalityBoardComponent {
  @Input() functionalities: any[] = [];
  @Output() viewTasks = new EventEmitter<number>();

  columns = [
    { id: 'PENDING', label: 'Pendiente' },
    { id: 'IN_PROGRESS', label: 'En progreso' },
    { id: 'COMPLETED', label: 'Completada' }
  ];

  getColumnFunctionalities(status: string): any[] {
    return this.functionalities.filter(f => f.status === status);
  }
}
