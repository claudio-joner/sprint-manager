import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css'
})
export class ProjectListComponent implements OnInit {

  projects: any[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    console.log('Componente cargado');
    this.projectService.getAll().subscribe(data => {
      console.log('Proyectos:', data);
      this.projects = data;
    });
  }
}