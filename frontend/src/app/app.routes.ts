import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { ProjectDetailComponent } from './projects/project-detail/project-detail';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'projects/:id', component: ProjectDetailComponent }
];
