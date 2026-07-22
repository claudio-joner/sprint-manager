import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'frontend';

  constructor(public theme: ThemeService) {
    this.theme.init();
  }
}
