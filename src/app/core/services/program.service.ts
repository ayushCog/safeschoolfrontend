import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppStore } from '../../store/app.store';
import { Program } from '../../store/models';
import { Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ProgramCreateInput {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface ProgramUpdateInput {
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProgramService {
  private readonly baseUrl = 'http://localhost:8081';
  private store = inject(AppStore);
  private http = inject(HttpClient);

  /**
   * Fetch all programs
   */
  getPrograms(): Observable<Program[]> {
    this.store.setLoading(true);
    return this.http
      .get<ApiResponse<Program[]>>(`${this.baseUrl}/program/`)
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(response.message || 'Failed to load programs');
          }
          return response.data;
        }),
        tap((programs) => {
          this.store.setPrograms(programs);
          this.store.setLoading(false);
        })
      );
  }

  /**
   * Fetch active programs
   */
  getActivePrograms(): Observable<Program[]> {
    return of(this.store.activePrograms());
  }

  /**
   * Fetch program by ID
   */
  getProgramById(programId: string): Observable<Program | undefined> {
    return of(this.store.programs().find((p) => p.programId === programId));
  }

  /**
   * Create new program
   */
  createProgram(program: Omit<Program, 'programId'>): Observable<Program> {
    this.store.setLoading(true);
    const input: ProgramCreateInput = {
      title: program.title,
      description: program.description,
      startDate: program.startDate,
      endDate: program.endDate,
      status: program.status,
    };
    return this.http
      .post<ApiResponse<Program>>(`${this.baseUrl}/program/create`, input)
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(response.message || 'Failed to create program');
          }
          return response.data;
        }),
        tap((newProgram) => {
          this.store.addProgram(newProgram);
          this.store.setLoading(false);
        })
      );
  }

  /**
   * Update program
   */
  updateProgram(programId: string, status: string): Observable<Program> {
    this.store.setLoading(true);
    const input: ProgramUpdateInput = { status };
    return this.http
      .put<ApiResponse<Program>>(`${this.baseUrl}/program/update/${programId}`, input)
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(response.message || 'Failed to update program');
          }
          return response.data;
        }),
        tap((updatedProgram) => {
          this.store.updateProgram(updatedProgram);
          this.store.setLoading(false);
        })
      );
  }

  /**
   * Delete program
   * TODO: Replace with actual HTTP call to backend
   */
  deleteProgram(programId: string): Observable<void> {
    this.store.setLoading(true);
    return of(void 0).pipe(
      delay(500),
      tap(() => {
        this.store.deleteProgram(programId);
        this.store.setLoading(false);
      })
    );
  }
}
