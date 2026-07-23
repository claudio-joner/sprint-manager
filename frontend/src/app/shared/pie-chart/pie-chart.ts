import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PieChartSlice {
  label: string;
  value: number;
  color: string;
}

interface PieChartSegment extends PieChartSlice {
  percent: number;
  dashArray: string;
  dashOffset: number;
}

const CIRCUMFERENCE = 100;

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pie-chart.html',
  styleUrl: './pie-chart.css'
})
export class PieChartComponent {
  @Input() data: PieChartSlice[] = [];

  get total(): number {
    return this.data.reduce((sum, d) => sum + d.value, 0);
  }

  get segments(): PieChartSegment[] {
    const total = this.total;
    let offsetAccum = 0;
    return this.data.map(d => {
      const percent = total > 0 ? (d.value / total) * 100 : 0;
      const dash = (percent / 100) * CIRCUMFERENCE;
      const segment: PieChartSegment = {
        ...d,
        percent,
        dashArray: `${dash} ${CIRCUMFERENCE - dash}`,
        dashOffset: -offsetAccum
      };
      offsetAccum += dash;
      return segment;
    });
  }
}
