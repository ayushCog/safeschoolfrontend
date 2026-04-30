import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ComplianceService } from '../../core/services/compliance.service';
import * as ComplianceActions from './compliance.actions';

@Injectable()
export class ComplianceEffects {
  private actions$ = inject(Actions);
  private complianceService = inject(ComplianceService);

  loadRecords$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ComplianceActions.loadComplianceRecords),
      switchMap(() =>
        this.complianceService.getComplianceRecords().pipe(
          map((records) => ComplianceActions.loadComplianceRecordsSuccess({ records })),
          catchError(() => of({ type: '[Compliance] Load Error' }))
        )
      )
    )
  );
}
