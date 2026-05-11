import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppStore } from '../../store/app.store';
import { Incident, IncidentStatus, IncidentType, Resolution } from '../../store/models';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { getApiResponseMessage } from './api-response.util';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface IncidentProjection {
  incidentId: string;
  reporter: string;
  type: IncidentType;
  location: string;
  date: string;
  status: IncidentStatus;
}

interface IncidentCreateInput {
  userId: string;
  type: IncidentType;
  location: string;
  date: string;
  status: IncidentStatus;
}

interface ResolutionProjection {
  resolutionId: string;
  incidentId: string;
  userId: string;
  actions: string | string[];
  date: string;
  status: IncidentStatus;
}

interface ResolutionCreateInput {
  incidentId: string;
  userId: string;
  actions: string | string[];
  date: string;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class IncidentService {
  private readonly baseUrl = 'http://localhost:8081';
  private store = inject(AppStore);
  private http = inject(HttpClient);

  private mapIncident(projection: IncidentProjection): Incident {
    return {
      incidentID: projection.incidentId,
      reporterID: projection.reporter,
      type: projection.type,
      location: projection.location,
      date: projection.date,
      status: projection.status,
    };
  }

  private normalizeActions(actions: string | string[]): string[] {
    if (Array.isArray(actions)) {
      return actions;
    }
    return actions
      .split(',')
      .map((action) => action.trim())
      .filter(Boolean);
  }

  private mapResolution(projection: ResolutionProjection): Resolution {
    return {
      resolutionID: projection.resolutionId,
      incidentID: projection.incidentId,
      officerID: projection.userId,
      actions: this.normalizeActions(projection.actions),
      date: projection.date,
      status: projection.status,
    };
  }

  private formatLocalDate(date: string | Date): string {
    if (typeof date === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      return date;
    }

    const dt = typeof date === 'string' ? new Date(date) : date;
    if (Number.isNaN(dt.getTime())) {
      throw new Error(`Invalid date format: ${date}`);
    }

    const day = String(dt.getDate()).padStart(2, '0');
    const month = String(dt.getMonth() + 1).padStart(2, '0');
    const year = dt.getFullYear();
    return `${day}/${month}/${year}`;
  }

  getIncidents(): Observable<Incident[]> {
    this.store.setLoading(true);
    return this.http
      .get<ApiResponse<IncidentProjection[]>>(`${this.baseUrl}/incidents/`)
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(getApiResponseMessage(response, 'Failed to load incidents'));
          }
          return response.data.map((item) => this.mapIncident(item));
        }),
        tap((incidents) => {
          this.store.setIncidents(incidents);
          this.store.setLoading(false);
        })
      );
  }

  getIncidentsByUserId(userId: string): Observable<Incident[]> {
    this.store.setLoading(true);
    return this.http
      .get<ApiResponse<IncidentProjection[]>>(`${this.baseUrl}/incidents/${userId}`)
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(getApiResponseMessage(response, 'Failed to load incidents for user'));
          }
          return response.data.map((item) => this.mapIncident(item));
        }),
        tap((incidents) => {
          this.store.setIncidents(incidents);
          this.store.setLoading(false);
        })
      );
  }

  getIncidentById(incidentID: string): Observable<Incident | undefined> {
    return this.http
      .get<ApiResponse<IncidentProjection>>(`${this.baseUrl}/incidents/${incidentID}`)
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(getApiResponseMessage(response, 'Failed to load incident'));
          }
          return this.mapIncident(response.data);
        })
      );
  }

  createIncident(incident: Incident): Observable<Incident> {
    this.store.setLoading(true);
    const payload: IncidentCreateInput = {
      userId: incident.reporterID,
      type: incident.type,
      location: incident.location,
      date: this.formatLocalDate(incident.date),
      status: incident.status,
    };

    return this.http
      .post<ApiResponse<IncidentProjection>>(
        `${this.baseUrl}/incidents/create`,
        payload,
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(getApiResponseMessage(response, 'Failed to create incident'));
          }
          return this.mapIncident(response.data);
        }),
        tap((newIncident) => {
          this.store.addIncident(newIncident);
          this.store.setLoading(false);
        })
      );
  }

  updateIncident(incident: Incident): Observable<Incident> {
    this.store.setLoading(true);
    return this.http
      .put<ApiResponse<IncidentProjection>>(
        `${this.baseUrl}/incidents/${incident.incidentID}`,
        {
          userId: incident.reporterID,
          type: incident.type,
          location: incident.location,
          date: this.formatLocalDate(incident.date),
          status: incident.status,
        },
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(getApiResponseMessage(response, 'Failed to update incident'));
          }
          return this.mapIncident(response.data);
        }),
        tap((updatedIncident) => {
          this.store.updateIncident(updatedIncident);
          this.store.setLoading(false);
        })
      );
  }

  updateIncidentStatus(incidentID: string, status: string): Observable<Incident> {
    this.store.setLoading(true);
    return this.http
      .put<ApiResponse<IncidentProjection>>(
        `${this.baseUrl}/incidents/${incidentID}`,
        { status },
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(response.message || 'Failed to update incident status');
          }
          return this.mapIncident(response.data);
        }),
        tap((updatedIncident) => {
          this.store.updateIncident(updatedIncident);
          this.store.setLoading(false);
        })
      );
  }

  deleteIncident(incidentID: string): Observable<void> {
    this.store.setLoading(true);
    return this.http
      .delete<ApiResponse<null>>(`${this.baseUrl}/incidents/${incidentID}`)
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(getApiResponseMessage(response, 'Failed to delete incident'));
          }
          return void 0;
        }),
        tap(() => {
          this.store.deleteIncident(incidentID);
          this.store.setLoading(false);
        })
      );
  }

  getResolutions(): Observable<Resolution[]> {
    this.store.setLoading(true);
    return this.http
      .get<ApiResponse<ResolutionProjection[]>>(`${this.baseUrl}/resolution/get/user/all`)
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(response.message || 'Failed to load resolutions');
          }
          return response.data.map((item) => this.mapResolution(item));
        }),
        tap((resolutions) => {
          this.store.setResolutions(resolutions);
          this.store.setLoading(false);
        })
      );
  }

  getResolutionsByIncidentId(incidentID: string): Observable<Resolution[]> {
    return this.http
      .get<ApiResponse<ResolutionProjection[]>>(
        `${this.baseUrl}/resolution/get/incident/${incidentID}`
      )
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(response.message || 'Failed to load resolutions');
          }
          return response.data.map((item) => this.mapResolution(item));
        })
      );
  }

  getResolutionsByUserId(userId: string): Observable<Resolution[]> {
    return this.http
      .get<ApiResponse<ResolutionProjection[]>>(
        `${this.baseUrl}/resolution/get/user/${userId}`
      )
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(response.message || 'Failed to load resolutions');
          }
          return response.data.map((item) => this.mapResolution(item));
        })
      );
  }

  createResolution(resolution: Resolution): Observable<Resolution> {
    this.store.setLoading(true);
    const payload: ResolutionCreateInput = {
      incidentId: resolution.incidentID,
      userId: resolution.officerID,
      actions: Array.isArray(resolution.actions)
        ? resolution.actions.join(', ')
        : resolution.actions,
      date: this.formatLocalDate(resolution.date),
      status: 'Resolved',
    };

    return this.http
      .post<ApiResponse<ResolutionProjection>>(
        `${this.baseUrl}/resolution/create`,
        payload,
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
      .pipe(
        map((response) => {
          if (!response.success) {
            console.log(response);
            throw new Error(response.message || 'Failed to create resolution');
          }
          return this.mapResolution(response.data);
        }),
        tap((newResolution) => {
          this.store.addResolution(newResolution);
          this.store.setLoading(false);
        })
      );
  }

  updateResolution(resolution: Resolution): Observable<Resolution> {
    this.store.setLoading(true);
    return this.http
      .put<ApiResponse<ResolutionProjection>>(
        `${this.baseUrl}/resolution/${resolution.resolutionID}`,
        {
          incidentId: resolution.incidentID,
          userId: resolution.officerID,
          actions: resolution.actions,
          date: resolution.date,
          status: resolution.status,
        },
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(response.message || 'Failed to update resolution');
          }
          return this.mapResolution(response.data);
        }),
        tap((updatedResolution) => {
          this.store.updateResolution(updatedResolution);
          this.store.setLoading(false);
        })
      );
  }

  deleteResolution(resolutionID: string): Observable<void> {
    this.store.setLoading(true);
    return this.http
      .delete<ApiResponse<null>>(`${this.baseUrl}/resolution/${resolutionID}`)
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(response.message || 'Failed to delete resolution');
          }
          return void 0;
        }),
        tap(() => {
          this.store.deleteResolution(resolutionID);
          this.store.setLoading(false);
        })
      );
  }
}
