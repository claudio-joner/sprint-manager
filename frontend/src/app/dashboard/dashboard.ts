import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../services/project';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  userName: string = 'Usuario';
  currentDate: string = '';
  totalProjects: number = 0;
  totalTasks: number = 0;
  nextTask: any = null;

  constructor(
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  goToProjects(): void {
    this.router.navigate(['/projects']);
  }

  ngOnInit(): void {
    this.currentDate = new Date().toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    this.projectService.getAll().subscribe({
      next: (data) => {
        console.log('data:', data);
        this.totalProjects = data.length;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('error:', err);
      }
    });
  }
}