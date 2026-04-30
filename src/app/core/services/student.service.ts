import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { AppStore } from '../../store/app.store';
import { Student, Parent } from '../../store/models';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private store = inject(AppStore);

  /**
   * Fetch all students
   * TODO: Replace with actual HTTP call to backend
   */
  getStudents(): Observable<Student[]> {
    this.store.setLoading(true);
    return of([]).pipe(
      delay(1000),
      tap((students) => {
        this.store.setStudents(students);
        this.store.setLoading(false);
      })
    );
  }

  /**
   * Fetch student by ID
   */
  getStudentById(studentID: string): Observable<Student | undefined> {
    return of(this.store.students().find((s) => s.studentID === studentID));
  }

  /**
   * Create new student
   * TODO: Replace with actual HTTP call to backend
   */
  createStudent(student: Student): Observable<Student> {
    this.store.setLoading(true);
    return of(student).pipe(
      delay(500),
      tap((newStudent) => {
        this.store.addStudent(newStudent);
        this.store.setLoading(false);
      })
    );
  }

  /**
   * Update student
   * TODO: Replace with actual HTTP call to backend
   */
  updateStudent(student: Student): Observable<Student> {
    this.store.setLoading(true);
    return of(student).pipe(
      delay(500),
      tap((updatedStudent) => {
        this.store.updateStudent(updatedStudent);
        this.store.setLoading(false);
      })
    );
  }

  /**
   * Delete student
   * TODO: Replace with actual HTTP call to backend
   */
  deleteStudent(studentID: string): Observable<void> {
    this.store.setLoading(true);
    return of(void 0).pipe(
      delay(500),
      tap(() => {
        this.store.deleteStudent(studentID);
        this.store.setLoading(false);
      })
    );
  }

  // Parent Management

  /**
   * Fetch all parents
   * TODO: Replace with actual HTTP call to backend
   */
  getParents(): Observable<Parent[]> {
    this.store.setLoading(true);
    return of([]).pipe(
      delay(1000),
      tap((parents) => {
        this.store.setParents(parents);
        this.store.setLoading(false);
      })
    );
  }

  /**
   * Fetch parents for a specific student
   */
  getParentsByStudentId(studentID: string): Observable<Parent[]> {
    return of(
      this.store
        .parents()
        .filter((p) => p.studentID === studentID)
    );
  }

  /**
   * Create new parent
   * TODO: Replace with actual HTTP call to backend
   */
  createParent(parent: Parent): Observable<Parent> {
    this.store.setLoading(true);
    return of(parent).pipe(
      delay(500),
      tap((newParent) => {
        this.store.addParent(newParent);
        this.store.setLoading(false);
      })
    );
  }

  /**
   * Update parent
   * TODO: Replace with actual HTTP call to backend
   */
  updateParent(parent: Parent): Observable<Parent> {
    this.store.setLoading(true);
    return of(parent).pipe(
      delay(500),
      tap((updatedParent) => {
        this.store.updateParent(updatedParent);
        this.store.setLoading(false);
      })
    );
  }

  /**
   * Delete parent
   * TODO: Replace with actual HTTP call to backend
   */
  deleteParent(parentID: string): Observable<void> {
    this.store.setLoading(true);
    return of(void 0).pipe(
      delay(500),
      tap(() => {
        this.store.deleteParent(parentID);
        this.store.setLoading(false);
      })
    );
  }
}
