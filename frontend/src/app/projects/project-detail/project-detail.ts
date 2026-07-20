import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project';
import { KanbanBoardComponent } from '../../kanban/kanban-board/kanban-board';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, KanbanBoardComponent],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css'
})
export class ProjectDetailComponent implements OnInit {

  project: any = null;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectService.getById(Number(id)).subscribe({
        next: (data) => {
          this.project = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log('error:', err);
        }
      });
    }
  }
}