import { Component } from '@angular/core';
import { ProjectListComponent } from './components/project-list/project-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProjectListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'frontend';
}