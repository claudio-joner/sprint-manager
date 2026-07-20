import { Routes } from '@angular/router';
import { ProjectListComponent } from './projects/project-list/project-list';
import { DashboardComponent } from './dashboard/dashboard';
import { ProjectDetailComponent } from './projects/project-detail/project-detail';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'projects', component: ProjectListComponent },
  { path: 'projects/:id', component: ProjectDetailComponent }
];