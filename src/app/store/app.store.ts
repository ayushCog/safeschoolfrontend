import { Injectable } from '@angular/core';
import {
  signal,
  computed,
  WritableSignal,
} from '@angular/core';
import {
  User,
  Student,
  Parent,
  Incident,
  Resolution,
  Program,
  Training,
  Notification,
  AuthState,
} from './models';

export interface AppState {
  auth: AuthState;
  users: User[];
  students: Student[];
  parents: Parent[];
  incidents: Incident[];
  resolutions: Resolution[];
  programs: Program[];
  trainings: Training[];
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AppState = {
  auth: {
    currentUser: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  },
  users: [],
  students: [],
  parents: [],
  incidents: [],
  resolutions: [],
  programs: [],
  trainings: [],
  notifications: [],
  isLoading: false,
  error: null,
};

@Injectable({
  providedIn: 'root',
})
export class AppStore {
  private readonly state: WritableSignal<AppState> = signal(initialState);

  readonly currentUser = computed(() => this.state().auth.currentUser);
  readonly isAuthenticated = computed(() => this.state().auth.isAuthenticated);
  readonly authIsLoading = computed(() => this.state().auth.isLoading);
  readonly authError = computed(() => this.state().auth.error);

  readonly users = computed(() => this.state().users);
  readonly students = computed(() => this.state().students);
  readonly parents = computed(() => this.state().parents);
  readonly incidents = computed(() => this.state().incidents);
  readonly resolutions = computed(() => this.state().resolutions);
  readonly programs = computed(() => this.state().programs);
  readonly trainings = computed(() => this.state().trainings);
  readonly notifications = computed(() => this.state().notifications);

  readonly isLoading = computed(() => this.state().isLoading);
  readonly error = computed(() => this.state().error);

  readonly unreadNotifications = computed(() => {
    const currentUser = this.currentUser();
    if (!currentUser) return [];
    return this.state()
      .notifications.filter(
        (n) => n.userID === currentUser.userID && n.status === 'unread'
      );
  });

  readonly unreadNotificationCount = computed(
    () => this.unreadNotifications().length
  );

  readonly activeIncidents = computed(() =>
    this.state().incidents.filter((i) => i.status !== 'archived')
  );

  readonly pendingResolutions = computed(() =>
    this.state().resolutions.filter((r) => r.status !== 'resolved')
  );

  readonly activePrograms = computed(() =>
    this.state().programs.filter((p) => p.status === 'active')
  );

  readonly pendingTrainings = computed(() =>
    this.state().trainings.filter(
      (t) => t.status === 'pending' || t.status === 'in_progress'
    )
  );

  setCurrentUser(user: User): void {
    this.state.update((s) => ({
      ...s,
      auth: {
        ...s.auth,
        currentUser: user,
        isAuthenticated: true,
        error: null,
      },
    }));
  }

  setAuthLoading(loading: boolean): void {
    this.state.update((s) => ({
      ...s,
      auth: { ...s.auth, isLoading: loading },
    }));
  }

  setAuthError(error: string | null): void {
    this.state.update((s) => ({
      ...s,
      auth: { ...s.auth, error, isLoading: false },
    }));
  }

  clearAuth(): void {
    this.state.update((s) => ({
      ...s,
      auth: {
        currentUser: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      },
    }));
  }

  // User Management Actions
  addUser(user: User): void {
    this.state.update((s) => ({
      ...s,
      users: [...s.users, user],
    }));
  }

  updateUser(user: User): void {
    this.state.update((s) => ({
      ...s,
      users: s.users.map((u) => (u.userID === user.userID ? user : u)),
    }));
  }

  deleteUser(userID: string): void {
    this.state.update((s) => ({
      ...s,
      users: s.users.filter((u) => u.userID !== userID),
    }));
  }

  setUsers(users: User[]): void {
    this.state.update((s) => ({
      ...s,
      users,
    }));
  }

  // Student Management Actions
  addStudent(student: Student): void {
    this.state.update((s) => ({
      ...s,
      students: [...s.students, student],
    }));
  }

  updateStudent(student: Student): void {
    this.state.update((s) => ({
      ...s,
      students: s.students.map((st) =>
        st.studentID === student.studentID ? student : st
      ),
    }));
  }

  deleteStudent(studentID: string): void {
    this.state.update((s) => ({
      ...s,
      students: s.students.filter((st) => st.studentID !== studentID),
    }));
  }

  setStudents(students: Student[]): void {
    this.state.update((s) => ({
      ...s,
      students,
    }));
  }

  // Parent Management Actions
  addParent(parent: Parent): void {
    this.state.update((s) => ({
      ...s,
      parents: [...s.parents, parent],
    }));
  }

  updateParent(parent: Parent): void {
    this.state.update((s) => ({
      ...s,
      parents: s.parents.map((p) =>
        p.parentID === parent.parentID ? parent : p
      ),
    }));
  }

  deleteParent(parentID: string): void {
    this.state.update((s) => ({
      ...s,
      parents: s.parents.filter((p) => p.parentID !== parentID),
    }));
  }

  setParents(parents: Parent[]): void {
    this.state.update((s) => ({
      ...s,
      parents,
    }));
  }

  // Incident Management Actions
  addIncident(incident: Incident): void {
    this.state.update((s) => ({
      ...s,
      incidents: [...s.incidents, incident],
    }));
  }

  updateIncident(incident: Incident): void {
    this.state.update((s) => ({
      ...s,
      incidents: s.incidents.map((i) =>
        i.incidentID === incident.incidentID ? incident : i
      ),
    }));
  }

  deleteIncident(incidentID: string): void {
    this.state.update((s) => ({
      ...s,
      incidents: s.incidents.filter((i) => i.incidentID !== incidentID),
    }));
  }

  setIncidents(incidents: Incident[]): void {
    this.state.update((s) => ({
      ...s,
      incidents,
    }));
  }

  // Resolution Management Actions
  addResolution(resolution: Resolution): void {
    this.state.update((s) => ({
      ...s,
      resolutions: [...s.resolutions, resolution],
    }));
  }

  updateResolution(resolution: Resolution): void {
    this.state.update((s) => ({
      ...s,
      resolutions: s.resolutions.map((r) =>
        r.resolutionID === resolution.resolutionID ? resolution : r
      ),
    }));
  }

  deleteResolution(resolutionID: string): void {
    this.state.update((s) => ({
      ...s,
      resolutions: s.resolutions.filter((r) => r.resolutionID !== resolutionID),
    }));
  }

  setResolutions(resolutions: Resolution[]): void {
    this.state.update((s) => ({
      ...s,
      resolutions,
    }));
  }

  // Program Management Actions
  addProgram(program: Program): void {
    this.state.update((s) => ({
      ...s,
      programs: [...s.programs, program],
    }));
  }

  updateProgram(program: Program): void {
    this.state.update((s) => ({
      ...s,
      programs: s.programs.map((p) =>
        p.programId === program.programId ? program : p
      ),
    }));
  }

  deleteProgram(programId: string): void {
    this.state.update((s) => ({
      ...s,
      programs: s.programs.filter((p) => p.programId !== programId),
    }));
  }

  setPrograms(programs: Program[]): void {
    this.state.update((s) => ({
      ...s,
      programs,
    }));
  }

  // Training Management Actions
  addTraining(training: Training): void {
    this.state.update((s) => ({
      ...s,
      trainings: [...s.trainings, training],
    }));
  }

  updateTraining(training: Training): void {
    this.state.update((s) => ({
      ...s,
      trainings: s.trainings.map((t) =>
        t.trainingId === training.trainingId ? training : t
      ),
    }));
  }

  deleteTraining(trainingId: string): void {
    this.state.update((s) => ({
      ...s,
      trainings: s.trainings.filter((t) => t.trainingId !== trainingId),
    }));
  }

  setTrainings(trainings: Training[]): void {
    this.state.update((s) => ({
      ...s,
      trainings,
    }));
  }

  addNotification(notification: Notification): void {
    this.state.update((s) => ({
      ...s,
      notifications: [...s.notifications, notification],
    }));
  }

  updateNotification(notification: Notification): void {
    this.state.update((s) => ({
      ...s,
      notifications: s.notifications.map((n) =>
        n.notificationID === notification.notificationID ? notification : n
      ),
    }));
  }

  markNotificationAsRead(notificationID: string): void {
    this.state.update((s) => ({
      ...s,
      notifications: s.notifications.map((n) =>
        n.notificationID === notificationID
          ? { ...n, status: 'read' as const, readDate: new Date().toISOString() }
          : n
      ),
    }));
  }

  deleteNotification(notificationID: string): void {
    this.state.update((s) => ({
      ...s,
      notifications: s.notifications.filter(
        (n) => n.notificationID !== notificationID
      ),
    }));
  }

  setNotifications(notifications: Notification[]): void {
    this.state.update((s) => ({
      ...s,
      notifications,
    }));
  }

  // Global Loading and Error States
  setLoading(loading: boolean): void {
    this.state.update((s) => ({
      ...s,
      isLoading: loading,
    }));
  }

  setError(error: string | null): void {
    this.state.update((s) => ({
      ...s,
      error,
      isLoading: false,
    }));
  }

  // Reset store to initial state
  reset(): void {
    this.state.set(initialState);
  }
}
