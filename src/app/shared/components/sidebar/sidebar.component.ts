import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MenuItem {
  label: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="sidebar" role="navigation" aria-label="Main navigation">
      <nav>
        <ul>
          @for (item of menuItems(); track item.label) {
            <li>
              <button
                class="menu-item"
                (click)="onMenuItemClick(item)"
                [attr.aria-expanded]="isExpanded(item)"
              >
                @if (item.icon) {
                  <span class="icon">{{ item.icon }}</span>
                }
                <span>{{ item.label }}</span>
              </button>
              @if (item.children && item.children.length > 0) {
                <ul class="submenu">
                  @for (child of item.children; track child.label) {
                    <li>
                      <button
                        class="submenu-item"
                        (click)="onMenuItemClick(child)"
                      >
                        {{ child.label }}
                      </button>
                    </li>
                  }
                </ul>
              }
            </li>
          }
        </ul>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      background-color: #1f2937;
      color: #f3f4f6;
      padding: 1rem 0;
      height: 100vh;
      overflow-y: auto;
    }

    nav ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .menu-item,
    .submenu-item {
      width: 100%;
      padding: 0.75rem 1rem;
      background: none;
      border: none;
      color: #f3f4f6;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background-color 0.2s;
    }

    .menu-item:hover,
    .submenu-item:hover {
      background-color: #374151;
    }

    .icon {
      display: inline-block;
      width: 1.25rem;
    }

    .submenu {
      list-style: none;
      padding-left: 1rem;
      margin: 0;
    }

    .submenu-item {
      padding-left: 2rem;
      font-size: 0.875rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  menuItems = input<MenuItem[]>([]);
  menuItemClicked = output<MenuItem>();

  isExpanded(item: MenuItem): boolean {
    return item.children ? item.children.length > 0 : false;
  }

  onMenuItemClick(item: MenuItem): void {
    this.menuItemClicked.emit(item);
  }
}
