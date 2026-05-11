import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppStore } from '../../store/app.store';
import { Training } from '../../store/models';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { getApiResponseMessage } from './api-response.util';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface TrainingCreateInput {
  programId: string;
  userId: string;
  completionDate: string;
  status: string;
}

interface TrainingUpdateInput {
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private readonly baseUrl = 'http://localhost:8081';
  private store = inject(AppStore);
  private http = inject(HttpClient);

  /**
   * Fetch trainings for a user
   */
  getTrainingsByUser(userId: string): Observable<Training[]> {
    this.store.setLoading(true);
    return this.http
      .get<ApiResponse<Training[]>>(`${this.baseUrl}/training/user/${userId}`)
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(getApiResponseMessage(response, 'Failed to load trainings'));
          }
          return response.data;
        }),
        tap((trainings) => {
          this.store.setTrainings(trainings);
          this.store.setLoading(false);
        })
      );
  }

  /**
   * Fetch trainings for a program
   */
  getTrainingsByProgram(programId: string): Observable<Training[]> {
    this.store.setLoading(true);
    return this.http
      .get<ApiResponse<Training[]>>(`${this.baseUrl}/training/program/${programId}`)
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(getApiResponseMessage(response, 'Failed to load trainings for program'));
          }
          return response.data;
        }),
        tap((trainings) => {
          // Maybe set in store if needed
          this.store.setLoading(false);
        })
      );
  }

  /**
   * Create new training
   */
  createTraining(training: Omit<Training, 'trainingId'>): Observable<Training> {
    this.store.setLoading(true);
    // Map Training model to API request format
    const input: TrainingCreateInput = {
      programId: training.programId,
      userId: training.userId,
      completionDate: training.completionDate || new Date().toLocaleDateString('dd/MM/yyyy'),
      status: training.status,
    };
    return this.http
      .post<ApiResponse<Training>>(`${this.baseUrl}/training/create`, input)
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(getApiResponseMessage(response, 'Failed to create training'));
          }
          return response.data;
        }),
        tap((newTraining) => {
          this.store.addTraining(newTraining);
          this.store.setLoading(false);
        })
      );
  }

  /**
   * Update training
   */
  updateTraining(trainingId: string, status: string): Observable<Training> {
    this.store.setLoading(true);
    const input: TrainingUpdateInput = { status };
    return this.http
      .put<ApiResponse<Training>>(`${this.baseUrl}/training/update/${trainingId}`, input)
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(getApiResponseMessage(response, 'Failed to update training'));
          }
          return response.data;
        }),
        tap((updatedTraining) => {
          this.store.updateTraining(updatedTraining);
          this.store.setLoading(false);
        })
      );
  }
}