import { Routes } from '@angular/router';
import { ProjectListComponent } from './projects/project-list/project-list';

export const routes: Routes = [
  { path: '', redirectTo: 'projects', pathMatch: 'full' },
  { path: 'projects', component: ProjectListComponent }
];