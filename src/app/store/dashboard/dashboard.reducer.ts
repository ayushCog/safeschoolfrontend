import { createReducer, on } from '@ngrx/store';
import * as DashboardActions from './dashboard.actions';

export interface DashboardState {
  stats: any;
  recentIncidents: any[];
  notifications: any[];
  loading: boolean;
  error: string | null;
}

export const initialState: DashboardState = {
  stats: null,
  recentIncidents: [],
  notifications: [],
  loading: false,
  error: null,
};

export const dashboardReducer = createReducer(
  initialState,

  on(DashboardActions.loadDashboardStats, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(DashboardActions.loadDashboardStatsSuccess, (state, { stats }) => ({
    ...state,
    stats,
    loading: false,
  })),

  on(DashboardActions.loadDashboardStatsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(DashboardActions.loadRecentIncidents, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(DashboardActions.loadRecentIncidentsSuccess, (state, { incidents }) => ({
    ...state,
    recentIncidents: incidents,
    loading: false,
  })),

  on(DashboardActions.loadRecentIncidentsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(DashboardActions.loadNotifications, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(DashboardActions.loadNotificationsSuccess, (state, { notifications }) => ({
    ...state,
    notifications,
    loading: false,
  })),

  on(DashboardActions.loadNotificationsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);