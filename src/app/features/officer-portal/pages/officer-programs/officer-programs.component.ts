import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppStore } from '../../../../store/app.store';
import { ProgramService } from '../../../../core/services/program.service';
import { ProgramStatus } from '../../../../store/models';

@Component({
  selector: 'app-officer-programs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './officer-programs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficerProgramsComponent implements OnInit {
  private programService = inject(ProgramService);
  private store = inject(AppStore);

  readonly programs = this.store.programs;
  readonly isLoading = this.store.isLoading;

  activeTab = signal<'create' | 'view'>('view');
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  newProgramTitle = '';
  newProgramDescription = '';
  newProgramStartDate = '';
  newProgramEndDate = '';
  newProgramStatus: ProgramStatus = 'active';

  ngOnInit(): void {
    this.programService.getPrograms().subscribe({
      next: () => this.errorMessage.set(null),
      error: (error) =>
        this.errorMessage.set(error?.message || 'Unable to load programs'),
    });
  }

  switchTab(tab: 'create' | 'view'): void {
    this.activeTab.set(tab);
  }

  formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  createProgram(): void {
    if (
      !this.newProgramTitle.trim() ||
      !this.newProgramDescription.trim() ||
      !this.newProgramStartDate.trim() ||
      !this.newProgramEndDate.trim()
    ) {
      this.errorMessage.set('Please fill in all program fields.');
      return;
    }

    this.errorMessage.set(null);
    
    this.programService
      .createProgram({
        title: this.newProgramTitle.trim(),
        description: this.newProgramDescription.trim(),
        startDate: this.formatDate(this.newProgramStartDate),
        endDate: this.formatDate(this.newProgramEndDate),
        status: this.newProgramStatus,
      })
      .subscribe({
        next: () => {
          this.errorMessage.set(null);
          this.successMessage.set('Program created successfully!');
          this.resetProgramForm();
          setTimeout(() => this.successMessage.set(null), 3000);
        },
        error: (error) => {
          this.errorMessage.set(error?.message || 'Unable to create program');
          this.successMessage.set(null);
        },
      });
  }

  endProgram(programId: string): void {
    this.programService.
    updateProgram(programId, 'ended').
    subscribe({
      next: () => {
        this.errorMessage.set(null);
        this.successMessage.set('Program ended successfully!');
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (error) => {
        this.errorMessage.set(error?.message || 'Unable to end program');
        this.successMessage.set(null);
      }
    })
  }

  resetProgramForm(): void {
    this.newProgramTitle = '';
    this.newProgramDescription = '';
    this.newProgramStartDate = '';
    this.newProgramEndDate = '';
    this.newProgramStatus = 'active';
  }
}
