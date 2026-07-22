import { Injectable } from '@angular/core';

const STORAGE_KEY = 'sprintmanager.theme';
type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  current: Theme = 'dark';

  init(): void {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    this.current = saved ?? 'dark';
    this.apply();
  }

  toggle(): void {
    this.current = this.current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, this.current);
    this.apply();
  }

  private apply(): void {
    document.documentElement.setAttribute('data-theme', this.current);
  }
}
