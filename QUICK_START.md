# Quick Start Guide - Safe School Application

## ✅ What's Been Implemented

### 1. **Data Models** (`src/app/store/models/`)
All 9 database entities with TypeScript interfaces:
- User, Student, Parent
- Incident, Resolution
- Program, Training
- ComplianceRecord, Notification

### 2. **Signal-Based State Store** (`src/app/store/app.store.ts`)
- Centralized state management using Angular Signals
- 20+ computed signals for derived state
- CRUD operations for all entities
- Loading and error states

### 3. **Core Services** (`src/app/core/services/`)
- **AuthService** - Login/logout, role checking
- **UserService** - User management
- **IncidentService** - Incident & resolution tracking
- **NotificationService** - Notification handling
- **ProgramService** - Program & training management
- **StudentService** - Student & parent management
- **ComplianceService** - Compliance tracking

### 4. **Role-Based Routing** (`src/app/app.routes.ts`)
Lazy-loaded feature routes:
- `/auth/login` - Public
- `/student/*` - Student/Parent portal
- `/teacher/*` - Teacher/Staff dashboard
- `/safety-officer/*` - Safety Officer console
- `/admin/*` - Admin panel
- `/compliance/*` - Compliance Officer console
- `/auditor/*` - Auditor dashboard

### 5. **Auth Guards** (`src/app/core/guards/`)
- `authGuard` - Verify authentication
- `roleGuard` - Verify role-based access

### 6. **Reusable Components** (`src/app/shared/components/`)
- **ButtonComponent** - Styled buttons (primary, secondary, danger)
- **TableComponent** - Generic table with `@for` loop
- **NavbarComponent** - Application header
- **SidebarComponent** - Navigation menu
- **StatCardComponent** - Dashboard metrics

### 7. **Auth Pages**
- **LoginComponent** - User authentication with demo accounts
- **LogoutComponent** - Session cleanup

## 🚀 Next Steps - Implementing Features

### Step 1: Create Feature Pages
Each role needs landing pages. Example for Student Portal:

```typescript
// src/app/features/student-portal/pages/report-incident/report-incident.component.ts

import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { inject } from '@angular/core';
import { CommonModule, ReactiveFormsModule } from '@angular/common';
import { IncidentService } from '../../../../core/services/incident.service';
import { AppStore } from '../../../../store/app.store';
import { Incident } from '../../../../store/models';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-report-incident',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  template: `
    <div class="incident-form">
      <h1>Report an Incident</h1>
      
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="type">Incident Type</label>
          <select id="type" [(ngModel)]="type()" (ngModelChange)="type.set($event)" name="type">
            @for (t of incidentTypes; track t) {
              <option [value]="t">{{ t }}</option>
            }
          </select>
        </div>

        <div class="form-group">
          <label for="location">Location</label>
          <input 
            id="location"
            type="text" 
            [(ngModel)]="location()" 
            (ngModelChange)="location.set($event)"
            name="location"
            placeholder="Where did this occur?"
          />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea 
            id="description"
            [(ngModel)]="description()" 
            (ngModelChange)="description.set($event)"
            name="description"
            placeholder="Provide details..."
          ></textarea>
        </div>

        <app-button label="Submit Report" variant="primary" buttonType="submit" />
      </form>

      @if (successMessage()) {
        <div class="success-message">{{ successMessage() }}</div>
      }
    </div>
  `,
  styles: [`...`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportIncidentComponent {
  private incidentService = inject(IncidentService);
  private store = inject(AppStore);

  type = signal('');
  location = signal('');
  description = signal('');
  successMessage = signal('');

  incidentTypes = ['violence', 'bullying', 'harassment', 'theft', 'vandalism', 'substance', 'emergency', 'other'];

  onSubmit(): void {
    const currentUser = this.store.currentUser();
    if (!currentUser) return;

    const incident: Incident = {
      incidentID: crypto.randomUUID(),
      reporterID: currentUser.userID,
      type: this.type() as any,
      location: this.location(),
      date: new Date().toISOString(),
      status: 'reported',
      description: this.description(),
    };

    this.incidentService.createIncident(incident).subscribe({
      next: () => {
        this.successMessage.set('Incident reported successfully!');
        this.type.set('');
        this.location.set('');
        this.description.set('');
      },
    });
  }
}
```

### Step 2: Create Dashboard Pages
Example for Admin Dashboard listing users:

```typescript
// src/app/features/admin-panel/pages/users/users.component.ts

import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../core/services/user.service';
import { AppStore } from '../../../../store/app.store';
import { TableComponent, TableColumn } from '../../../../shared/components/table/table.component';
import { User } from '../../../../store/models';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, TableComponent],
  template: `
    <div class="users-page">
      <h1>User Management</h1>
      
      @if (store.isLoading()) {
        <p>Loading users...</p>
      } @else {
        <app-table [columns]="columns" [data]="store.users()" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  store = inject(AppStore);

  columns: TableColumn<User>[] = [
    { header: 'Name', key: 'name' },
    { header: 'Email', key: 'email' },
    { header: 'Role', key: 'role' },
    { header: 'Status', key: 'status' },
  ];

  ngOnInit(): void {
    this.userService.getUsers().subscribe();
  }
}
```

## 📋 Implementation Checklist

### Feature Pages to Create
- [ ] Student Portal
  - [ ] Report Incident
  - [ ] My Notifications
  - [ ] My Reports
- [ ] Teacher Dashboard
  - [ ] Log Incident
  - [ ] My Trainings
  - [ ] Compliance Status
- [ ] Safety Officer Console
  - [ ] Incidents List
  - [ ] Resolve Incident
  - [ ] Drill Scheduling
- [ ] Admin Panel
  - [ ] Users Management
  - [ ] Programs Management
  - [ ] Staff Management
  - [ ] Reports
- [ ] Compliance Officer
  - [ ] Policies
  - [ ] Audits
  - [ ] Compliance Reports
- [ ] Auditor Dashboard
  - [ ] Safety Review
  - [ ] Compliance Monitoring

### Services to Complete
- [ ] Replace mock HTTP calls with real backend endpoints
- [ ] Add error handling
- [ ] Implement pagination/filtering
- [ ] Add data caching

### Forms to Create
- [ ] Incident Report Form (Reactive)
- [ ] User Management Form
- [ ] Program Creation Form
- [ ] Training Assignment Form
- [ ] Compliance Audit Form

## 🔌 API Integration Example

Replace mock service with real HTTP:

```typescript
// Before (Current - Mock)
getIncidents(): Observable<Incident[]> {
  this.store.setLoading(true);
  return of([]).pipe(
    delay(1000),
    tap((incidents) => {
      this.store.setIncidents(incidents);
      this.store.setLoading(false);
    })
  );
}

// After (Real API)
constructor(private http: HttpClient) {}

getIncidents(): Observable<Incident[]> {
  this.store.setLoading(true);
  return this.http.get<Incident[]>('/api/incidents').pipe(
    tap((incidents) => {
      this.store.setIncidents(incidents);
      this.store.setLoading(false);
    }),
    catchError((error) => {
      this.store.setError('Failed to load incidents');
      throw error;
    })
  );
}
```

## 💡 Key Patterns to Remember

### 1. Using Signals in Components
```typescript
// Declare signals
mySignal = signal<string>('default');

// Read value
{{ mySignal() }}

// Update value
this.mySignal.set('new value');
this.mySignal.update(v => v + ' updated');
```

### 2. Using @for Loop
```typescript
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}
```

### 3. Using @if/@switch
```typescript
@if (condition()) {
  <div>Show if true</div>
} @else {
  <div>Show if false</div>
}

@switch (status()) {
  @case ('active') {
    <span class="badge-green">Active</span>
  }
  @case ('inactive') {
    <span class="badge-gray">Inactive</span>
  }
}
```

### 4. Injecting Services
```typescript
private service = inject(MyService);
private store = inject(AppStore);
private router = inject(Router);
```

### 5. Creating Reusable Components
```typescript
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent {
  // Inputs
  data = input<string>('default');
  
  // Outputs
  clicked = output<string>();
  
  // Methods
  onClick() {
    this.clicked.emit('value');
  }
}
```

## 📞 Demo Login Credentials

```
Student: student@safeschool.com / password
Parent: parent@safeschool.com / password
Teacher: teacher@safeschool.com / password
Safety Officer: officer@safeschool.com / password
Admin: admin@safeschool.com / password
```

## 🧪 Testing the Setup

1. Start the dev server: `npm start`
2. Navigate to `http://localhost:4200`
3. Login with any demo account
4. You'll be redirected to the role-specific dashboard
5. Components are ready - now build the pages!

## 📚 Resources

- [Angular 21 Documentation](https://angular.dev)
- [Signals Guide](https://angular.dev/guide/signals)
- [Routing & Navigation](https://angular.dev/guide/routing)
- [Dependency Injection](https://angular.dev/guide/dependency-injection)

---

**You're all set!** Start building the feature pages using the patterns established in the foundation. The store, services, and components are ready to go! 🚀
