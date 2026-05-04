import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { loadStudentIncidentReports } from '../../../../store/student-portal/student-portal.actions';
import { selectStudentIncidentReportsForCurrentUser, selectStudentPortalLoading } from '../../../../store/student-portal/student-portal.selectors';

@Component({
  selector: 'app-my-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-reports.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyReportsComponent implements OnInit {
  private store = inject(Store);

  // Use 'any[]' or your Incident model instead of 'unknown[]' to avoid template errors
  reports$ = this.store.select(selectStudentIncidentReportsForCurrentUser);
  loading$ = this.store.select(selectStudentPortalLoading);

  ngOnInit(): void {
    this.store.dispatch(loadStudentIncidentReports());
  }
}