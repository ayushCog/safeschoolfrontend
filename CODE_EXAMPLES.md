# Code Examples - Safe School Application

## 📚 Complete Implementation Examples

### 1. Dashboard Component (Using Store + Shared Components)

```typescript
// src/app/features/admin-panel/pages/dashboard/dashboard.component.ts

import { Component, OnInit, ChangeDetectionStrategy, computed } from '@angular/core';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidentService } from '../../../../core/services/incident.service';
import { AppStore } from '../../../../store/app.store';
import { NavbarComponent, StatCardComponent } from '../../../../shared/components';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, StatCardComponent],
  template: `
    <div class="dashboard-layout">
      <!-- Navbar -->
      <app-navbar
        applicationTitle="Safe School Admin"
        [userName]="store.currentUser()?.name"
        [notificationCount]="store.unreadNotificationCount()"
      />

      <main class="dashboard-content">
        <h1>Dashboard</h1>
        
        <!-- Stats Grid -->
        <div class="stats-grid">
          <app-stat-card
            title="Total Incidents"
            [value]="totalIncidents()"
            icon="🚨"
            [trend]="incidentTrend()"
            description="This week"
          />
          
          <app-stat-card
            title="Active Programs"
            [value]="store.activePrograms().length"
            icon="📚"
            description="Currently running"
          />
          
          <app-stat-card
            title="Pending Trainings"
            [value]="store.pendingTrainings().length"
            icon="🎓"
            [trend]="incidentTrend()"
            description="Assigned to staff"
          />
          
          <app-stat-card
            title="Compliance Issues"
            [value]="store.nonCompliantRecords().length"
            icon="⚠️"
            [trend]="incidentTrend()"
            description="Require attention"
          />
        </div>

        <!-- Recent Incidents Section -->
        <section class="recent-incidents">
          <h2>Recent Incidents</h2>
          @if (store.isLoading()) {
            <p>Loading incidents...</p>
          } @else if (store.activeIncidents().length > 0) {
            <div class="incident-list">
              @for (incident of store.activeIncidents().slice(0, 5); track incident.incidentID) {
                <div class="incident-card">
                  <span class="incident-type">{{ incident.type }}</span>
                  <span class="incident-location">{{ incident.location }}</span>
                  <span class="incident-status" [class]="'status-' + incident.status">
                    {{ incident.status }}
                  </span>
                </div>
              }
            </div>
          } @else {
            <p>No incidents recorded.</p>
          }
        </section>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: #f9fafb;
    }

    .dashboard-content {
      flex: 1;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }

    h1 {
      font-size: 1.875rem;
      font-weight: 700;
      margin-bottom: 2rem;
      color: #1f2937;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .recent-incidents {
      background: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .incident-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .incident-card {
      padding: 1rem;
      border-left: 4px solid #3b82f6;
      background-color: #f9fafb;
      border-radius: 0.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .incident-type {
      font-weight: 600;
      color: #1f2937;
      text-transform: capitalize;
    }

    .incident-location {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .incident-status {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-reported {
      background-color: #fef3c7;
      color: #92400e;
    }

    .status-investigating {
      background-color: #dbeafe;
      color: #0c4a6e;
    }

    .status-resolved {
      background-color: #dcfce7;
      color: #166534;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements OnInit {
  store = inject(AppStore);
  private incidentService = inject(IncidentService);

  // Computed signals
  totalIncidents = computed(() => this.store.incidents().length);
  
  incidentTrend = computed(() => {
    const total = this.totalIncidents();
    return total > 5 ? 'down' : total < 3 ? 'up' : 'neutral';
  });

  ngOnInit(): void {
    // Load data when component initializes
    this.incidentService.getIncidents().subscribe();
  }
}
```

---

### 2. Incident List with Table Component

```typescript
// src/app/features/safety-officer/pages/incidents/incidents.component.ts

import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidentService } from '../../../../core/services/incident.service';
import { AppStore } from '../../../../store/app.store';
import { TableComponent, TableColumn } from '../../../../shared/components/table/table.component';
import { Incident } from '../../../../store/models';

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [CommonModule, TableComponent],
  template: `
    <div class="incidents-page">
      <header class="page-header">
        <h1>Incident Management</h1>
        <button class="btn-new-incident" (click)="onNewIncident()">
          + New Incident
        </button>
      </header>

      @if (store.isLoading()) {
        <div class="loading">Loading incidents...</div>
      } @else if (store.activeIncidents().length > 0) {
        <app-table
          [columns]="columns"
          [data]="store.activeIncidents()"
        />
      } @else {
        <div class="empty-state">No incidents to display.</div>
      }
    </div>
  `,
  styles: [`
    .incidents-page {
      padding: 2rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1 {
      margin: 0;
      font-size: 1.875rem;
    }

    .btn-new-incident {
      padding: 0.5rem 1rem;
      background-color: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-weight: 500;
    }

    .btn-new-incident:hover {
      background-color: #2563eb;
    }

    .loading,
    .empty-state {
      padding: 2rem;
      text-align: center;
      color: #6b7280;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncidentsComponent implements OnInit {
  store = inject(AppStore);
  private incidentService = inject(IncidentService);

  columns: TableColumn<Incident>[] = [
    { header: 'Incident ID', key: 'incidentID', width: '100px' },
    { header: 'Type', key: 'type', width: '100px' },
    { header: 'Location', key: 'location' },
    { header: 'Date', key: 'date', width: '150px' },
    { header: 'Status', key: 'status', width: '100px' },
  ];

  ngOnInit(): void {
    this.incidentService.getIncidents().subscribe();
  }

  onNewIncident(): void {
    // Navigate to new incident form
    console.log('Navigate to new incident form');
  }
}
```

---

### 3. Form Component with Signals

```typescript
// src/app/features/student-portal/pages/report-incident/report-incident.component.ts

import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncidentService } from '../../../../core/services/incident.service';
import { AppStore } from '../../../../store/app.store';
import { Incident } from '../../../../store/models';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-report-incident',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, NgOptimizedImage],
  template: `
    <div class="form-container">
      <h1>Report an Incident</h1>

      <form (ngSubmit)="onSubmit()" #form="ngForm">
        <div class="form-group">
          <label for="incident-type">Incident Type *</label>
          <select
            id="incident-type"
            [(ngModel)]="formData.type"
            name="type"
            required
            aria-label="Select incident type"
          >
            <option value="">-- Select Type --</option>
            @for (type of incidentTypes; track type) {
              <option [value]="type">{{ type | titlecase }}</option>
            }
          </select>
        </div>

        <div class="form-group">
          <label for="incident-location">Location *</label>
          <input
            id="incident-location"
            type="text"
            [(ngModel)]="formData.location"
            name="location"
            placeholder="Where did this occur?"
            required
            aria-label="Incident location"
          />
        </div>

        <div class="form-group">
          <label for="incident-date">Date & Time</label>
          <input
            id="incident-date"
            type="datetime-local"
            [(ngModel)]="formData.date"
            name="date"
            aria-label="Incident date and time"
          />
        </div>

        <div class="form-group">
          <label for="incident-description">Description *</label>
          <textarea
            id="incident-description"
            [(ngModel)]="formData.description"
            name="description"
            placeholder="Describe what happened..."
            required
            rows="5"
            aria-label="Incident description"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="incident-witnesses">Witnesses (optional)</label>
          <textarea
            id="incident-witnesses"
            [(ngModel)]="formData.witnesses"
            name="witnesses"
            placeholder="Names or descriptions of witnesses..."
            rows="3"
            aria-label="Witnesses"
          ></textarea>
        </div>

        @if (errorMessage()) {
          <div class="error-message" role="alert">
            ⚠️ {{ errorMessage() }}
          </div>
        }

        @if (successMessage()) {
          <div class="success-message" role="status">
            ✅ {{ successMessage() }}
          </div>
        }

        <div class="form-actions">
          <app-button
            label="Submit Report"
            variant="primary"
            [isDisabled]="isSubmitting()"
            buttonType="submit"
          />
          <app-button
            label="Clear"
            variant="secondary"
            (click)="onReset()"
            buttonType="button"
          />
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    h1 {
      margin: 0 0 2rem 0;
      font-size: 1.875rem;
      color: #1f2937;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    label {
      font-weight: 500;
      color: #1f2937;
      font-size: 0.875rem;
    }

    input,
    select,
    textarea {
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.25rem;
      font-size: 1rem;
      font-family: inherit;
    }

    input:focus,
    select:focus,
    textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .error-message {
      background-color: #fee2e2;
      color: #dc2626;
      padding: 0.75rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
    }

    .success-message {
      background-color: #dcfce7;
      color: #166534;
      padding: 0.75rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportIncidentComponent {
  private incidentService = inject(IncidentService);
  private store = inject(AppStore);

  incidentTypes = [
    'violence',
    'bullying',
    'harassment',
    'theft',
    'vandalism',
    'substance',
    'emergency',
    'other',
  ];

  formData = signal({
    type: '',
    location: '',
    date: new Date().toISOString().slice(0, 16),
    description: '',
    witnesses: '',
  });

  isSubmitting = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    const data = this.formData();

    if (!data.type || !data.location || !data.description) {
      this.errorMessage.set('Please fill in all required fields');
      return;
    }

    const currentUser = this.store.currentUser();
    if (!currentUser) {
      this.errorMessage.set('User not authenticated');
      return;
    }

    this.isSubmitting.set(true);

    const incident: Incident = {
      incidentID: crypto.randomUUID(),
      reporterID: currentUser.userID,
      type: data.type as any,
      location: data.location,
      date: data.date,
      status: 'reported',
      description: data.description,
      witnesses: data.witnesses ? data.witnesses.split(',').map((w) => w.trim()) : [],
    };

    this.incidentService.createIncident(incident).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.successMessage.set('Your incident report has been submitted successfully!');
        this.resetForm();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set('Failed to submit report. Please try again.');
        console.error(err);
      },
    });
  }

  onReset(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.formData.set({
      type: '',
      location: '',
      date: new Date().toISOString().slice(0, 16),
      description: '',
      witnesses: '',
    });
  }
}
```

---

### 4. Using AppStore in a Component

```typescript
// Example: Using store signals and computed values

import { Component, computed, ChangeDetectionStrategy } from '@angular/core';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStore } from '../../../../store/app.store';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications">
      <h2>Notifications ({{ unreadCount() }})</h2>

      @if (store.isLoading()) {
        <p>Loading...</p>
      } @else if (store.unreadNotifications().length > 0) {
        <ul class="notification-list">
          @for (notif of store.unreadNotifications(); track notif.notificationID) {
            <li class="notification-item">
              <p>{{ notif.message }}</p>
              <span class="category">{{ notif.category }}</span>
            </li>
          }
        </ul>
      } @else {
        <p>No unread notifications.</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent {
  store = inject(AppStore);

  // Derived state using computed()
  unreadCount = computed(() => this.store.unreadNotificationCount());
}
```

---

## 🎯 Key Takeaways

1. **Always use `ChangeDetectionStrategy.OnPush`** for performance
2. **Use `signal()`** for component state instead of properties
3. **Use `computed()`** for derived state
4. **Use `@for/@if/@switch`** for template control flow
5. **Use `input()` and `output()`** for component communication
6. **Inject services** with `inject()` function
7. **Leverage AppStore** for global state management
8. **Keep components small** and focused on a single responsibility

---

All examples follow Angular 21 best practices with Signals, OnPush change detection, and standalone components! 🚀
