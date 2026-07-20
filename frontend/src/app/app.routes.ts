import { Routes } from '@angular/router';
import { ProjectListComponent } from './components/project-list/project-list';

export const routes: Routes = [
  { path: '', component: ProjectListComponent },
  { path: 'projects', component: ProjectListComponent }
];