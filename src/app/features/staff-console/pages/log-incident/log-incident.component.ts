import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { logIncident } from '../../../../store/staff-portal/staff-portal.actions';
import { selectCurrentUser } from '../../../../store/auth/auth.selectors';
import { Incident } from '../../../../store/models';

@Component({
  selector: 'app-log-incident',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './log-incident.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogIncidentComponent {
  private store = inject(Store);
  submitted = signal(false);

  incidentType = 'bullying';
  location = '';
  description = '';
  private currentUser$ = this.store.select(selectCurrentUser);

  async submitIncident(): Promise<void> {
    const user = await firstValueFrom(this.currentUser$);
    if (!user) {
      alert('Unable to log incident without a valid staff user.');
      return;
    }

    const incident: Incident = {
      incidentID: `staff-${Date.now()}`,
      reporterID: user.userID,
      type: this.incidentType as any,
      location: this.location,
      date: new Date().toISOString(),
      status: 'reported',
      description: this.description,
    };

    this.store.dispatch(logIncident({ incident }));
    this.submitted.set(true);
    this.location = '';
    this.description = '';
    setTimeout(() => this.submitted.set(false), 3000);
  }
}