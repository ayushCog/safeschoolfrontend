# Safe School - School Safety Management System

## 📋 Project Overview

A comprehensive Angular 21 application for managing school safety incidents, training, compliance, and emergency response across multiple user roles.

## 🏗️ Architecture

### Modern Angular Stack
- **Signals** for reactive state management (Angular 16+)
- **Standalone Components** (Angular 14+)
- **@for/@if/@switch** control flow (Angular 17+)
- **OnPush Change Detection** for performance
- **Functional Guards** for role-based access
- **Lazy-loaded Routes** by role

### Project Structure

```
src/app/
├── auth/                          # Authentication feature
│   ├── pages/
│   │   ├── login/
│   │   └── logout/
│   └── auth.routes.ts
├── core/                          # Core services & guards
│   ├── guards/
│   │   └── auth.guard.ts
│   └── services/
│       ├── auth.service.ts
│       ├── user.service.ts
│       ├── incident.service.ts
│       ├── notification.service.ts
│       ├── program.service.ts
│       ├── student.service.ts
│       ├── compliance.service.ts
│       └── index.ts
├── features/                      # Feature modules (lazy-loaded)
│   ├── student-portal/
│   ├── teacher-dashboard/
│   ├── safety-officer/
│   ├── admin-panel/
│   ├── compliance-officer/
│   └── auditor-dashboard/
├── shared/                        # Shared components & utilities
│   └── components/
│       ├── button/
│       ├── table/
│       ├── sidebar/
│       ├── navbar/
│       ├── stat-card/
│       └── index.ts
├── store/                         # State management
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── student.model.ts
│   │   ├── parent.model.ts
│   │   ├── incident.model.ts
│   │   ├── program.model.ts
│   │   ├── training.model.ts
│   │   ├── compliance.model.ts
│   │   ├── notification.model.ts
│   │   └── index.ts
│   └── app.store.ts              # Signals-based state store
├── app.routes.ts                 # Main routing configuration
└── app.ts                         # Root component
```

## 🎯 Database Schema (TypeScript Models)

### Core Entities

1. **User** - All system users
   - UserID, Name, Role, Email, Phone, Status
   - Roles: student, parent, teacher, staff, safety_officer, admin, compliance_officer, auditor

2. **Student** - Student records
   - StudentID, Name, DOB, Gender, Address, ContactInfo, Status

3. **Parent** - Parent/Guardian information
   - ParentID, Name, ContactInfo, Relation, StudentID, Status

4. **Incident** - Safety incident reports
   - IncidentID, ReporterID, Type, Location, Date, Status, Description, Witnesses

5. **Resolution** - Incident resolution actions
   - ResolutionID, IncidentID, OfficerID, Actions, Date, Status, Notes

6. **Program** - Safety programs/initiatives
   - ProgramID, Title, Description, StartDate, EndDate, Status, Objectives

7. **Training** - Staff training records
   - TrainingID, ProgramID, StaffID, CompletionDate, Status, CertificationExpiry

8. **ComplianceRecord** - Compliance tracking
   - ComplianceID, EntityID, Type, Result, Date, Notes, ReviewedBy

9. **Notification** - User notifications
   - NotificationID, UserID, EntityID, Message, Category, Status, CreatedDate

## 🛠️ State Management (Signals)

### AppStore
Located in `src/app/store/app.store.ts`

**Root Signal:**
```typescript
state: WritableSignal<AppState>
```

**Key Computed Signals:**
- `currentUser` - Current authenticated user
- `isAuthenticated` - Auth status
- `unreadNotifications` - User's unread notifications
- `unreadNotificationCount` - Count of unread messages
- `activeIncidents` - Non-archived incidents
- `pendingTrainings` - Pending/in-progress trainings
- `nonCompliantRecords` - Non-compliant records

**Main Methods:**
- Authentication: `setCurrentUser()`, `clearAuth()`, `setAuthLoading()`
- CRUD Operations: `add*()`, `update*()`, `delete*()`, `set*()`
- State Management: `setLoading()`, `setError()`, `reset()`

## 🔐 Authentication & Authorization

### Guards
- **authGuard** - Checks if user is authenticated
- **roleGuard** - Checks if user has required role

### Roles & Access

| Role | Routes | Features |
|------|--------|----------|
| Student/Parent | `/student/*` | Report incidents, view notifications, my reports |
| Teacher/Staff | `/teacher/*` | Log incidents, view training, compliance status |
| Safety Officer | `/safety-officer/*` | Manage incidents, schedule drills |
| Admin | `/admin/*` | User management, programs, staff, reports |
| Compliance Officer | `/compliance/*` | Policy monitoring, audits, compliance reports |
| Auditor | `/auditor/*` | Safety review, compliance monitoring |

## 🧩 Services

### AuthService
Handles user authentication and session management.

```typescript
login(credentials): Observable<User>
logout(): Observable<void>
isAuthenticated(): boolean
getCurrentUser(): User | null
hasRole(role): boolean
hasAnyRole(roles): boolean
```

### IncidentService
Manages incident reports and resolutions.

```typescript
getIncidents(): Observable<Incident[]>
createIncident(incident): Observable<Incident>
updateIncident(incident): Observable<Incident>
deleteIncident(incidentID): Observable<void>

// Resolutions
getResolutions(): Observable<Resolution[]>
createResolution(resolution): Observable<Resolution>
updateResolution(resolution): Observable<Resolution>
```

### NotificationService
Handles user notifications.

```typescript
getNotifications(): Observable<Notification[]>
getUnreadNotifications(): Observable<Notification[]>
createNotification(notification): Observable<Notification>
markAsRead(notificationID): Observable<void>
deleteNotification(notificationID): Observable<void>
getUnreadCount(): number
```

### UserService
Manages user records.

```typescript
getUsers(): Observable<User[]>
getUserById(userID): Observable<User | undefined>
createUser(user): Observable<User>
updateUser(user): Observable<User>
deleteUser(userID): Observable<void>
```

### ProgramService & TrainingService
Manages programs and training records.

### StudentService
Manages student and parent records.

### ComplianceService
Manages compliance tracking and reporting.

## 🎨 Shared Components

All components use:
- `ChangeDetectionStrategy.OnPush` for performance
- `input()` function instead of `@Input()` decorator
- `output()` function instead of `@Output()` decorator
- Native control flow (`@for`, `@if`, `@switch`)
- Standalone components

### ButtonComponent
```typescript
label: string
variant: 'primary' | 'secondary' | 'danger'
isDisabled: boolean
buttonType: 'button' | 'submit' | 'reset'
```

### TableComponent
Generic table with `@for` loop over columns and data.

```typescript
columns: TableColumn<T>[]
data: T[]
```

### NavbarComponent
Application header with user info and navigation.

```typescript
applicationTitle: string
userName: string | null
notificationCount: number

Events:
notificationClicked()
profileClicked()
logoutClicked()
```

### SidebarComponent
Navigation menu with nested items.

```typescript
menuItems: MenuItem[]

Events:
menuItemClicked(item: MenuItem)
```

### StatCardComponent
Dashboard metric display.

```typescript
title: string
value: string | number
icon: string | null
description: string | null
trend: 'up' | 'down' | 'neutral' | null
```

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development Server

```bash
npm start
```

Server runs on `http://localhost:4200`

### Building for Production

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## 🔄 Service Implementation Pattern

Each service follows this pattern:

1. **Inject AppStore**
   ```typescript
   private store = inject(AppStore);
   ```

2. **Set Loading State**
   ```typescript
   this.store.setLoading(true);
   ```

3. **Fetch from Backend** (TODO: Replace with actual HTTP)
   ```typescript
   // of([]) simulates HTTP call
   return of([]).pipe(
     delay(1000),
     tap((data) => {
       this.store.set*(data);
       this.store.setLoading(false);
     })
   );
   ```

4. **Update Store**
   ```typescript
   this.store.add*() // Create
   this.store.update*() // Update
   this.store.delete*() // Delete
   ```

## 📝 Component Pattern

```typescript
import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule],
  template: `...`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent {
  // Inputs (replaces @Input)
  title = input<string>('Default');
  
  // Outputs (replaces @Output)
  clicked = output<void>();
  
  // Methods
  onAction() {
    this.clicked.emit();
  }
}
```

## 🔗 API Integration TODO

Replace all service mock implementations with actual HTTP calls:

```typescript
// Before (mock)
return of(data).pipe(delay(1000), tap(...));

// After (HTTP)
return this.http.get<Type>('/api/endpoint').pipe(
  tap((data) => this.store.set*(data))
);
```

## 📊 Key Features

- ✅ Multi-role access control
- ✅ Lazy-loaded routes by role
- ✅ Signal-based state management
- ✅ Incident tracking and resolution
- ✅ Training & compliance monitoring
- ✅ Notification system
- ✅ Staff management
- ✅ Audit trail & reporting
- ✅ Modern Angular best practices
- ✅ OnPush change detection throughout
- ✅ Accessible components (ARIA labels, roles)

## 🎯 Next Steps

1. **API Integration** - Replace mock services with actual backend calls
2. **Feature Pages** - Build role-specific pages using shared components
3. **Forms** - Create reactive forms for data entry
4. **Validation** - Add comprehensive form validation
5. **Error Handling** - Implement error boundaries and user feedback
6. **Testing** - Add unit and integration tests
7. **Styling** - Enhance UI with design system
8. **Deployment** - Configure CI/CD pipeline

## 📚 Modern Angular Patterns Used

| Pattern | Location | Purpose |
|---------|----------|---------|
| Signals | `app.store.ts` | Reactive state management |
| Computed | `app.store.ts` | Derived state values |
| @for/@if | Components | Native control flow |
| input() | Components | Type-safe inputs |
| output() | Components | Type-safe outputs |
| inject() | Services | Dependency injection |
| OnPush | All components | Performance optimization |
| Standalone | All modules | Modern component model |
| Lazy Loading | Routes | Code splitting |
| Guard Functions | Routes | Access control |

---

**Framework:** Angular 21  
**TypeScript:** Strict mode  
**Architecture:** Signal-based Reactive  
**UI Pattern:** Standalone Components with OnPush Detection
