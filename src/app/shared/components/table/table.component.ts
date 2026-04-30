import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn<T> {
  header: string;
  key: keyof T;
  width?: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-container">
      <table role="table" aria-label="data table">
        <thead>
          <tr>
            @for (column of columns(); track column.key) {
              <th [style.width]="column.width">{{ column.header }}</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (item of data(); track trackByKey(item)) {
            <tr>
              @for (column of columns(); track column.key) {
                <td>{{ item[column.key] }}</td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .table-container {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }

    thead {
      background-color: #f3f4f6;
      border-bottom: 2px solid #e5e7eb;
    }

    th {
      padding: 0.75rem;
      text-align: left;
      font-weight: 600;
      color: #1f2937;
    }

    td {
      padding: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
    }

    tbody tr:hover {
      background-color: #f9fafb;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T> {
  columns = input<TableColumn<T>[]>([]);
  data = input<T[]>([]);

  trackByKey(item: T): any {
    return item;
  }
}
