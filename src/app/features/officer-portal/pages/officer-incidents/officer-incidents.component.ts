import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStore } from '../../../../store/app.store';
import { IncidentService } from '../../../../core/services/incident.service';

@Component({
  selector: 'app-officer-incidents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './officer-incidents.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficerIncidentsComponent implements OnInit {
  private incidentService = inject(IncidentService);
  private store = inject(AppStore);

  readonly incidents = this.store.incidents;
  readonly isLoading = this.store.isLoading;

  ngOnInit(): void {
    this.incidentService.getIncidents().subscribe();
  }
}
