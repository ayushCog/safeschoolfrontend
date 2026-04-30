import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { AppStore } from '../../store/app.store';
import { ComplianceRecord } from '../../store/models';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ComplianceService {
  private store = inject(AppStore);

  /**
   * Fetch all compliance records
   * TODO: Replace with actual HTTP call to backend
   */
  getComplianceRecords(): Observable<ComplianceRecord[]> {
    this.store.setLoading(true);
    return of([]).pipe(
      delay(1000),
      tap((records) => {
        this.store.setComplianceRecords(records);
        this.store.setLoading(false);
      })
    );
  }

  /**
   * Fetch non-compliant records
   */
  getNonCompliantRecords(): Observable<ComplianceRecord[]> {
    return of(this.store.nonCompliantRecords());
  }

  /**
   * Fetch compliance records by entity
   */
  getRecordsByEntityId(entityID: string): Observable<ComplianceRecord[]> {
    return of(
      this.store
        .complianceRecords()
        .filter((r) => r.entityID === entityID)
    );
  }

  /**
   * Create compliance record
   * TODO: Replace with actual HTTP call to backend
   */
  createRecord(record: ComplianceRecord): Observable<ComplianceRecord> {
    this.store.setLoading(true);
    return of(record).pipe(
      delay(500),
      tap((newRecord) => {
        this.store.addComplianceRecord(newRecord);
        this.store.setLoading(false);
      })
    );
  }

  /**
   * Update compliance record
   * TODO: Replace with actual HTTP call to backend
   */
  updateRecord(record: ComplianceRecord): Observable<ComplianceRecord> {
    this.store.setLoading(true);
    return of(record).pipe(
      delay(500),
      tap((updatedRecord) => {
        this.store.updateComplianceRecord(updatedRecord);
        this.store.setLoading(false);
      })
    );
  }

  /**
   * Delete compliance record
   * TODO: Replace with actual HTTP call to backend
   */
  deleteRecord(complianceID: string): Observable<void> {
    this.store.setLoading(true);
    return of(void 0).pipe(
      delay(500),
      tap(() => {
        this.store.deleteComplianceRecord(complianceID);
        this.store.setLoading(false);
      })
    );
  }

  /**
   * Get compliance summary statistics
   */
  getComplianceSummary(): { compliant: number; nonCompliant: number; pending: number } {
    const records = this.store.complianceRecords();
    return {
      compliant: records.filter((r) => r.result === 'compliant').length,
      nonCompliant: records.filter(
        (r) => r.result === 'non_compliant' || r.result === 'partially_compliant'
      ).length,
      pending: records.filter((r) => r.result === 'pending').length,
    };
  }
}
